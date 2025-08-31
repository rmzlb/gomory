import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import { BoardLayout } from '@/lib/types'

export interface ExportError {
  code: 'CANVAS_ERROR' | 'BLOB_ERROR' | 'DOWNLOAD_ERROR' | 'PDF_ERROR'
  message: string
  originalError?: Error
}

export interface ExportOptions {
  filename?: string
  quality?: number
  backgroundColor?: string
}

/**
 * Downloads a blob as a file
 */
function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Export an HTML element as PNG
 */
export async function exportElementAsPNG(
  element: HTMLElement,
  options: ExportOptions = {}
): Promise<void> {
  const {
    filename = 'export.png',
    quality = 0.95,
    backgroundColor = '#ffffff',
  } = options

  try {
    const canvas = await html2canvas(element, {
      backgroundColor,
      scale: 2,
      logging: false,
      useCORS: true,
    })

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject({
              code: 'BLOB_ERROR',
              message: 'Failed to create image blob',
            } as ExportError)
            return
          }
          
          try {
            downloadBlob(blob, filename)
            resolve()
          } catch (error) {
            reject({
              code: 'DOWNLOAD_ERROR',
              message: 'Failed to download file',
              originalError: error as Error,
            } as ExportError)
          }
        },
        'image/png',
        quality
      )
    })
  } catch (error) {
    throw {
      code: 'CANVAS_ERROR',
      message: 'Failed to capture element as canvas',
      originalError: error as Error,
    } as ExportError
  }
}

/**
 * Export an SVG element as file
 */
export function exportSVG(
  svgElement: SVGElement,
  filename = 'export.svg'
): void {
  const serializer = new XMLSerializer()
  const svgString = serializer.serializeToString(svgElement)
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
  downloadBlob(blob, filename)
}

/**
 * Create a complete PDF document with multiple boards
 */
export async function exportBoardsAsPDF(
  boards: BoardLayout[],
  boardDimensions: { width: number; height: number },
  filename = 'cutting_plan.pdf'
): Promise<void> {
  try {
    const pdf = new jsPDF({
      orientation: boardDimensions.width > boardDimensions.height ? 'landscape' : 'portrait',
      unit: 'mm',
      format: 'a4',
    })

    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const margin = 10

    // Add title page
    pdf.setFontSize(20)
    pdf.text('Cutting Plan', pageWidth / 2, 30, { align: 'center' })
    
    pdf.setFontSize(12)
    pdf.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, 40, { align: 'center' })
    pdf.text(`Total boards: ${boards.length}`, pageWidth / 2, 50, { align: 'center' })
    
    // Calculate average utilization
    const avgUtilization = boards.reduce((sum, b) => sum + (b.utilization || 0), 0) / boards.length
    pdf.text(`Average utilization: ${(avgUtilization * 100).toFixed(1)}%`, pageWidth / 2, 60, { align: 'center' })

    // Add each board on a new page
    for (let i = 0; i < boards.length; i++) {
      pdf.addPage()
      
      // Page header
      pdf.setFontSize(14)
      pdf.text(`Board ${i + 1}`, margin, margin + 10)
      
      pdf.setFontSize(10)
      pdf.text(`Utilization: ${((boards[i].utilization || 0) * 100).toFixed(1)}%`, margin, margin + 18)
      pdf.text(`Pieces: ${boards[i].pieces.length}`, margin, margin + 24)
      
      // Get the board visualization element
      const boardElement = document.getElementById(`board-${i}`)
      if (boardElement) {
        try {
          const canvas = await html2canvas(boardElement, {
            backgroundColor: '#ffffff',
            scale: 2,
            logging: false,
          })
          
          const imgData = canvas.toDataURL('image/png')
          const imgWidth = pageWidth - (2 * margin)
          const imgHeight = (canvas.height * imgWidth) / canvas.width
          
          // Check if image fits on page
          const maxHeight = pageHeight - margin - 35
          const finalHeight = Math.min(imgHeight, maxHeight)
          const finalWidth = imgHeight > maxHeight ? (canvas.width * finalHeight) / canvas.height : imgWidth
          
          pdf.addImage(imgData, 'PNG', margin, margin + 30, finalWidth, finalHeight)
        } catch (error) {
          console.error(`Failed to add board ${i + 1} to PDF:`, error)
        }
      }
    }

    // Save the PDF
    pdf.save(filename)
  } catch (error) {
    throw {
      code: 'PDF_ERROR',
      message: 'Failed to generate PDF',
      originalError: error as Error,
    } as ExportError
  }
}

/**
 * Generate a filename with timestamp
 */
export function generateFilename(prefix: string, extension: string): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
  return `${prefix}_${timestamp}.${extension}`
}