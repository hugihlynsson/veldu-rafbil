// Read a PDF price list on a Mac without poppler. Uses PDFKit and CoreGraphics,
// which ship with macOS.
//
//   pdf text  <pdf>                       the text layer, one block per page
//   pdf pages <pdf> <output dir> [scale]  every page as a JPEG
//
// Compile it once (`swiftc -O pdf.swift -o pdf`); running the source with
// `swift pdf.swift` recompiles every time and takes half a minute.
//
// Prefer `text` for numbers: it returns the digits exactly, where reading a
// rendered page risks a misread. It returns nothing for a PDF that is only
// images, and then `pages` is the way in. Scale 1 for `pages` is the PDF's own
// size (72 dpi), too small to read a table; the default of 2.5 is enough for
// most, and a page whose content is small inside a large sheet wants more,
// followed by a crop.
import CoreGraphics
import Foundation
import ImageIO
import PDFKit

func fail(_ message: String, _ code: Int32 = 1) -> Never {
  fputs(message + "\n", stderr)
  exit(code)
}

let args = CommandLine.arguments
guard args.count >= 3 else {
  fail("usage: pdf text <pdf> | pdf pages <pdf> <output dir> [scale]", 2)
}
let mode = args[1]
let source = URL(fileURLWithPath: args[2])

switch mode {
case "text":
  guard let doc = PDFDocument(url: source) else { fail("cannot open \(args[2]) as a PDF") }
  for n in 0..<doc.pageCount {
    print("=== page \(n + 1) ===")
    print(doc.page(at: n)?.string ?? "")
  }

case "pages":
  guard args.count >= 4 else { fail("usage: pdf pages <pdf> <output dir> [scale]", 2) }
  let scale = args.count > 4 ? CGFloat(Double(args[4]) ?? 2.5) : 2.5
  let outDir = URL(fileURLWithPath: args[3], isDirectory: true)
  guard let doc = CGPDFDocument(source as CFURL) else { fail("cannot open \(args[2]) as a PDF") }
  try FileManager.default.createDirectory(at: outDir, withIntermediateDirectories: true)

  let colorSpace = CGColorSpaceCreateDeviceRGB()
  for n in 1...max(doc.numberOfPages, 1) {
    guard let page = doc.page(at: n) else { continue }

    // A rotated page reports its media box unrotated; swap the sides to match.
    let box = page.getBoxRect(.mediaBox)
    let turned = page.rotationAngle % 180 != 0
    let width = Int((turned ? box.height : box.width) * scale)
    let height = Int((turned ? box.width : box.height) * scale)

    guard
      let context = CGContext(
        data: nil, width: width, height: height, bitsPerComponent: 8, bytesPerRow: 0,
        space: colorSpace, bitmapInfo: CGImageAlphaInfo.noneSkipLast.rawValue)
    else { continue }

    // PDFs are transparent by default; a JPEG would come out black.
    context.setFillColor(CGColor(red: 1, green: 1, blue: 1, alpha: 1))
    context.fill(CGRect(x: 0, y: 0, width: width, height: height))
    context.concatenate(
      page.getDrawingTransform(
        .mediaBox, rect: CGRect(x: 0, y: 0, width: width, height: height), rotate: 0,
        preserveAspectRatio: true))
    context.drawPDFPage(page)

    guard let image = context.makeImage() else { continue }
    let file = outDir.appendingPathComponent("page_\(n).jpg")
    guard
      let destination = CGImageDestinationCreateWithURL(
        file as CFURL, "public.jpeg" as CFString, 1, nil)
    else { continue }
    CGImageDestinationAddImage(
      destination, image, [kCGImageDestinationLossyCompressionQuality: 0.85] as CFDictionary)
    if CGImageDestinationFinalize(destination) { print(file.path) }
  }

default:
  fail("unknown mode \(mode); use text or pages", 2)
}
