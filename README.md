# Tech to Bash Converter

A beautiful, responsive web application that converts your tech code, commands, and snippets into properly formatted bash code blocks for GitHub, documentation, and other markdown platforms.

## ✨ Features

- **Real-time Conversion**: Instantly converts your input to bash code blocks as you type
- **GitHub Preview**: See exactly how your code blocks will appear on GitHub
- **One-Click Copy**: Copy formatted code blocks to clipboard with a single click

## 🚀 Demo

Visit the live demo: [Tech to Bash Converter](https://lovable.dev/projects/dd1926f3-56c5-4ad2-9214-7b57dcb54346)

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Shadcn/ui component library
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Notifications**: Sonner toast notifications

## 📖 How to Use

1. **Enter Your Code**: Paste or type your tech code, commands, or snippets in the input area
2. **See the Output**: The formatted bash code block appears instantly in the output section
3. **Preview on GitHub**: Check how it will look on GitHub in the preview panel
4. **Copy & Use**: Click the copy button to copy the formatted code block

## 💡 Examples

### Example 1: Installing Dependencies
**Input:**
```
npm install react typescript
```

**Output:**
```bash
npm install react typescript
```

### Example 2: Git Commands
**Input:**
```
git add .
git commit -m "Initial commit"
git push origin main
```

**Output:**
```bash
git add .
git commit -m "Initial commit"  
git push origin main
```

### Example 3: Docker Commands
**Input:**
```
docker build -t my-app .
docker run -p 3000:3000 my-app
```

**Output:**
```bash
docker build -t my-app .
docker run -p 3000:3000 my-app
```

### Example 4: System Commands
**Input:**
```
sudo apt update
sudo apt install nodejs npm
node --version
```

**Output:**
```bash
sudo apt update
sudo apt install nodejs npm
node --version
```

## 🎯 Use Cases

- **Documentation**: Format commands for README files and technical documentation
- **GitHub Issues/PRs**: Share properly formatted code blocks in discussions
- **Tutorials**: Create consistent code examples for tutorials and guides
- **Stack Overflow**: Format your questions and answers with proper syntax highlighting
- **Team Communication**: Share formatted commands in Slack, Discord, or other platforms

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## 🎨 Features in Detail

### Input Section
- Large textarea with monospace font
- Auto-focus for immediate typing
- Placeholder text with usage hints
- Clear button to reset input

### Output Section  
- Read-only formatted output
- Monospace font for code consistency
- Visual bash language indicator
- Copy to clipboard functionality

### GitHub Preview Section
- Realistic GitHub interface mockup
- Shows syntax highlighting as it appears on GitHub
- Terminal-style window with colored dots
- Actual GitHub interface screenshot for context

### User Experience
- Responsive 3-column layout (collapses on smaller screens)
- Toast notifications for user feedback
- Accessible design with proper ARIA labels
- Keyboard shortcuts support

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Lucide React](https://lucide.dev/) for the icon set
- [Tailwind CSS](https://tailwindcss.com/) for the styling system
- [Vite](https://vitejs.dev/) for the build tool
- [Lovable](https://lovable.dev/) for the development platform

---

Made with ❤️ for developers who love clean, formatted code blocks.
