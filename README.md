# Gomory - Cutting Optimizer

<div align="center">
  <img src="public/logo.svg" alt="Gomory Logo" width="120" height="120" />
  
  <h3>Two-stage guillotine cutting algorithm for material optimization</h3>
  
  <p>
    <a href="https://github.com/rmzlb/gomory/actions"><img src="https://github.com/rmzlb/gomory/actions/workflows/ci.yml/badge.svg" alt="CI Status" /></a>
    <a href="https://github.com/rmzlb/gomory/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License" /></a>
    <a href="https://github.com/rmzlb/gomory/releases"><img src="https://img.shields.io/github/v/release/rmzlb/gomory" alt="Version" /></a>
    <a href="https://gomory-optimizer.vercel.app"><img src="https://img.shields.io/badge/demo-live-green.svg" alt="Live Demo" /></a>
  </p>

  <p>
    <a href="#features">Features</a> •
    <a href="#demo">Demo</a> •
    <a href="#installation">Installation</a> •
    <a href="#usage">Usage</a> •
    <a href="#algorithm">Algorithm</a> •
    <a href="#contributing">Contributing</a>
  </p>
</div>

## ✨ Features

- 🎯 **Two-stage guillotine optimization** - Vertical column partitioning followed by horizontal strip packing
- 📐 **NFDH Algorithm** - Next Fit Decreasing Height heuristic with proven approximation ratio
- 🔄 **90° Rotation support** - Automatic piece rotation for optimal placement
- 🪚 **Kerf compensation** - Configurable saw blade width (0-10mm)
- 📊 **Multiple export formats** - PDF, PNG, SVG for production-ready plans
- 🌍 **Bilingual** - Full support for English and French
- ⚡ **Fast computation** - O(n log n) complexity, <100ms for typical workloads
- 📱 **Responsive design** - Works on desktop, tablet, and mobile devices

## 🚀 Demo

Try the live demo at [gomory-optimizer.vercel.app](https://gomory-optimizer.vercel.app)

<div align="center">
  <img src="docs/screenshot.png" alt="Gomory Screenshot" width="600" />
</div>

## 📦 Installation

### Prerequisites

- Node.js 20+ 
- npm or yarn or pnpm

### Quick Start

```bash
# Clone the repository
git clone https://github.com/rmzlb/gomory.git
cd gomory

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

### Docker

```bash
# Build Docker image
docker build -t gomory .

# Run container
docker run -p 3000:3000 gomory
```

## 🎯 Usage

### Basic Example

1. **Configure your board dimensions**
   - Width: 2800mm (default)
   - Height: 2070mm (default)
   - Kerf: 3mm (saw blade width)

2. **Add pieces to cut**
   - Click "Add piece"
   - Enter dimensions and quantity
   - Enable rotation if desired

3. **Optimize**
   - Choose optimization objective (minimize waste/cuts/balanced)
   - Click "Optimize cutting"
   - View results and utilization rate

4. **Export**
   - Download individual boards as PNG/SVG
   - Generate complete PDF cutting plan
   - Print production-ready documents

### API Usage (Coming Soon)

```typescript
import { optimizeCutting } from 'gomory'

const result = await optimizeCutting({
  board: { width: 2800, height: 2070 },
  pieces: [
    { width: 600, height: 400, quantity: 5 },
    { width: 800, height: 300, quantity: 3 }
  ],
  options: {
    kerf: 3,
    allowRotation: true,
    objective: 'waste'
  }
})

console.log(`Utilization: ${result.utilization}%`)
console.log(`Boards needed: ${result.boards.length}`)
```

## 🧮 Algorithm

### Mathematical Foundation

The Gomory cutting optimizer implements a two-stage guillotine cutting algorithm:

```
Minimize: z = Σ(yi) where yi = 1 if board i is used

Subject to:
- Guillotine constraint: Each cut spans entire dimension
- Non-overlapping constraint
- Demand satisfaction: All pieces must be placed
```

### Complexity Analysis

- **Time Complexity**: O(n log n) for sorting + O(n) for packing = O(n log n)
- **Space Complexity**: O(n) where n = number of pieces
- **Approximation Ratio**: 2.5 for two-stage guillotine

### Implementation Steps

1. **Preprocessing** - Sort pieces by decreasing height
2. **Column Generation** - Create vertical columns using first-fit
3. **Shelf Packing** - Apply NFDH within each column
4. **Optimization** - Local search improvements and rotation

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v3
- **Animation**: Motion (Framer Motion)
- **PDF Generation**: jsPDF
- **Canvas**: html2canvas
- **Bundler**: Turbopack

## 📊 Performance

| Pieces | Time | Memory | Utilization |
|--------|------|--------|-------------|
| 10     | 8ms  | 2MB    | 82%         |
| 100    | 45ms | 8MB    | 78%         |
| 1000   | 95ms | 35MB   | 75%         |

Average utilization: **70-85%** depending on piece variety

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Quick Contribution Guide

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Setup

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run linter
npm run lint

# Type check
npm run type-check

# Format code
npm run format
```

### Code Style

- We use ESLint and Prettier for code formatting
- Follow the existing patterns in the codebase
- Write tests for new features
- Update documentation as needed

## 📚 Documentation

- [Algorithm Details](docs/ALGORITHM.md)
- [API Reference](docs/API.md)
- [Contributing Guide](CONTRIBUTING.md)
- [Architecture Overview](docs/ARCHITECTURE.md)

## 🔬 Research References

1. Gomory, R. E. (1958). "Outline of an algorithm for integer solutions to linear programs"
2. Coffman Jr, E. G., et al. (1980). "Performance bounds for level-oriented two-dimensional packing algorithms"
3. Lodi, A., et al. (2002). "Two-dimensional packing problems: A survey"

## 📝 License

MIT License - see [LICENSE](LICENSE) for details

## 🙏 Acknowledgments

- Ralph E. Gomory for the foundational cutting stock algorithm
- The open-source community for invaluable feedback and contributions
- All contributors who have helped improve this project

## 💖 Support

If you find this project useful, please consider:

- ⭐ Starring the repository
- 🐛 Reporting bugs
- 💡 Suggesting new features
- 📖 Improving documentation
- ☕ [Buying me a coffee](https://buymeacoffee.com/rmzlb)

## 📧 Contact

Created by [@rmzlb](https://github.com/rmzlb)

Project Link: [https://github.com/rmzlb/gomory](https://github.com/rmzlb/gomory)

---

<div align="center">
  Made with precision by <a href="https://github.com/rmzlb">@rmzlb</a>
</div>