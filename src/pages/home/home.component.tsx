import { useHomeStyle } from "./home.style";
import telimatAz from "../../assets/pdfs/İnzibatçıTəlimatıAz.pdf";
import telimatRu from "../../assets/pdfs/İnzibatçıTəlimatıRu.pdf";
import telimatEng from "../../assets/pdfs/İnzibatçıTəlimatıEng.pdf";
import jwtDecode from "jwt-decode";
import { GuideIcon } from "assets/images/icons/guide";
import axios from "axios";
import { useEffect, useState } from "react";

function HomeComponent() {
  const [adminData, setAdminData] = useState<any>(null);
  const {
    homeMain,
    guides,
    eachGuide,
    adminInfo,
    guidesMain,
    adminDetailBox,
    adminDetailItem,
    adminLabel,
    profilPhoto,
    infoHeader,
    adminHeaderLeft,
    adminText,
  } = useHomeStyle();

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

  const getAdminData = async () => {
    try {
      const response = await axios.get(
        "https://tc2c-fvaisoutbusiness.customs.gov.az:3535/api/Account/user-data",
        {
          headers: {
            accept: "application/json",
            "api-key": storedToken || "",
          },
        }
      );
      setAdminData(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAdminData();
  }, []);
  console.log(adminData);

  return (
    <div className={homeMain}>
      <div className={adminInfo}>
        <h2 className={adminText}>İnzibatçı Məlumatları</h2>
        {adminData ? (
          <div className={adminDetailBox}>
            <div className={infoHeader}>
              <img
                className={profilPhoto}
                src={
                  adminData.image
                    ? "data:image/jpeg;base64,"+adminData.image
                    : "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
                }
                alt=""
              />
              <div className={adminHeaderLeft}>
                <div className={adminDetailItem}>
                  <span className={adminLabel}>Adı: </span>
                  {adminData.userInfo}
                </div>
                <div className={adminDetailItem}>
                  <span className={adminLabel}>Vəzifəsi: </span>
                  {adminData.positionName}
                </div>
                <div className={adminDetailItem}>
                  <span className={adminLabel}>İdarə: </span>
                  {adminData.customsName}
                </div>
              </div>
            </div>
            <div className={adminDetailItem}>
              <span className={adminLabel}>Departament: </span>
              {adminData.firmName}
            </div>

            <div className={adminDetailItem}>
              <span className={adminLabel}>Inspektor ID: </span>
              {adminData.inspectorId}
            </div>
            <div className={adminDetailItem}>
              <span className={adminLabel}>Telefon: </span>
              {adminData.phone}
            </div>
          </div>
        ) : (
          <p>Admin Datası yüklənir...</p>
        )}
      </div>
      <div className={guidesMain}>
        <h2 className={adminText}>Təlimatlar</h2>
        <div className={guides}>
          <button
            className={eachGuide}
            onClick={() => downloadPDF(pdfs.telimatAz)}
          >
            {GuideIcon()}
            Azərbaycanca təlimat
          </button>
          <br />
          <br />
          <button
            className={eachGuide}
            onClick={() => downloadPDF(pdfs.telimatRu)}
          >
            {GuideIcon()}
            Rusca təlimat
          </button>
          <br />
          <br />
          <button
            className={eachGuide}
            onClick={() => downloadPDF(pdfs.telimatEng)}
          >
            {GuideIcon()}
            İngiliscə təlimat
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomeComponent;
