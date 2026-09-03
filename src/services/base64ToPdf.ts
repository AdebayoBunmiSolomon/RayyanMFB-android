import RNFS from 'react-native-fs';
import Share from 'react-native-share';

export const convertBase64ToPdf = async (
  base64Pdf: string,
  fileName: string,
) => {
  try {
    const pdfFilePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

    // Decode the base64 string and write to a PDF file
    await RNFS.writeFile(pdfFilePath, base64Pdf, 'base64');

    // Share the PDF file
    await Share.open({
      url: `file://${pdfFilePath}`,
      type: 'application/pdf',
      filename: fileName,
      title: 'Share Transaction Receipt',
    });
  } catch (error) {}
};

export const shareJpgReceipt = async (jpeg: string) => {
  try {
    // Share the JPEG file
    await Share.open({
      url: `file://${jpeg}`,
      type: 'image/jpeg',
      filename: 'Transaction Receipt',
      title: 'Share Transaction Receipt',
    });
  } catch (error) {}
};
