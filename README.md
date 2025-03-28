# 📝 Image to Text Extractor

<div align="center">
  <img src="/frontend/src/assets/screenshot.png" alt="Image to Text Generator" width="800px">
  
  <p>
    <strong>Extract text from images with advanced OCR technology</strong>
  </p>
  
  <p>
    <a href="#features">Features</a> •
    <a href="#demo">Demo</a> •
    <a href="#installation">Installation</a> •
    <a href="#usage">Usage</a> •
    <a href="#technologies">Technologies</a>
  </p>
</div>

## ✨ Features

- **Text Extraction** - Extract text from any image, including handwritten content
- **Multiple Export Options** - Download extracted text as Word document or PDF
- **Copy to Clipboard** - Easily copy extracted text with one click
- **Beautiful UI** - Modern, responsive dark-themed interface
- **Advanced OCR** - Utilizes state-of-the-art OCR technology for accurate text recognition
- **Image Preview** - Preview uploaded images before processing

## 🎬 Demo

<div align="center">
  <img src="/frontend/src/assets/screenshot.png" alt="Home page" width="700px">
</div>

## 🚀 Installation

### Prerequisites

- Python 3.8+
- Node.js 14+
- npm or yarn

### Backend Setup

1. Clone the repository
2. Set up Python virtual environment
3. Install backend dependencies
4. Run the backend server
   
   The server will start at http://127.0.0.1:5000

### Frontend Setup

1. Install frontend dependencies
2. Run the frontend development server
   
   The application will open at http://localhost:3000

## 📖 Usage

1. **Upload an Image**
   - Click on the upload area or drag and drop an image file
   - The image will be previewed before processing

2. **Extract Text**
   - Click the "Extract Text" button to process the image
   - The application will use OCR to identify and extract text

3. **Use the Extracted Text**
   - Copy the text to clipboard
   - Download as a Word document
   - Download as a PDF file

## 💡 Tips for Best Results

- **Image Quality**: Higher resolution images yield better results
- **Lighting**: Well-lit images with good contrast between text and background work best
- **Orientation**: Properly oriented text (not sideways or upside down) is recognized more accurately
- **Handwriting**: For handwritten text, clear and consistent handwriting produces better results

## 🔧 Technologies

### Backend
- **Flask**: Web server framework
- **EasyOCR**: Optical Character Recognition engine
- **OpenCV**: Image preprocessing and enhancement
- **NumPy**: Numerical processing for image manipulation

### Frontend
- **React**: UI framework
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client for API requests
- **jsPDF**: PDF generation
- **File-Saver**: File download functionality

## 🙏 Acknowledgements

- [EasyOCR](https://github.com/JaidedAI/EasyOCR) for the powerful OCR engine
- [OpenCV](https://opencv.org/) for image processing capabilities
- [React Icons](https://react-icons.github.io/react-icons/) for the beautiful icons

---

<div align="center">
  <p>Made with ❤️ by Your Name</p>
</div>