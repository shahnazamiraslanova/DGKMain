import { useHomeStyle } from "./home.style";
import telimatAz from "../../assets/pdfs/TəlimatAz.pdf";
import telimatRu from "../../assets/pdfs/TəlimatRu.pdf";
import telimatEng from "../../assets/pdfs/TəlimatEng.pdf";
import jwtDecode from "jwt-decode";
function HomeComponent() {
  const { homeMain, adminInfo } = useHomeStyle();
  const pdfs = {
    telimatAz,
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
  const storedToken = localStorage.getItem("token");
  const decodedToken = storedToken ? jwtDecode(storedToken) : null;
  console.log(decodedToken);

  return (
    <div className={homeMain}>
      <div className={adminInfo}>salam</div>
      <div>
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
    </div>
  );
}

export default HomeComponent;
