import { useHomeStyle } from "./home.style";
import telimatAz from "../../assets/pdfs/TəlimatAz.pdf";
import telimatRu from "../../assets/pdfs/TəlimatRu.pdf";
import telimatEng from "../../assets/pdfs/TəlimatEng.pdf";
function HomeComponent() {
const {homeMain}=useHomeStyle();
const pdfs = {
    telimatAz, // Directly using imported paths
    telimatRu,
    telimatEng,
  };

  const downloadPDF = (pdfPath: string): void => {
    const link = document.createElement("a");
    link.href = pdfPath;
    link.download = pdfPath.split("/").pop() || ""; 
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); 
  };

  return (
    <div className={homeMain}>
      <h2>Təlimatı yükləyin</h2>

      <button onClick={() => downloadPDF(pdfs.telimatAz)}>
        Azərbaycanca təlimat
      </button>

      <br /> <br />

      <button onClick={() => downloadPDF(pdfs.telimatRu)}>
       Rusca təlimat
      </button>

      <br /> <br />

      <button onClick={() => downloadPDF(pdfs.telimatEng)}>
        İngiliscə təlimat
      </button>
    </div>
  );
}

export default HomeComponent;
