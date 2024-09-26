import { useHomeStyle } from "./home.style";
import telimatAz from "../../assets/pdfs/TəlimatAz.pdf";
import telimatRu from "../../assets/pdfs/TəlimatRu.pdf";
import telimatEng from "../../assets/pdfs/TəlimatEng.pdf";
import jwtDecode from "jwt-decode";
import { GuideIcon } from "assets/images/icons/guide";
import axios from "axios";
import { useEffect, useState } from "react";

function HomeComponent() {
  const [adminData, setAdminData] = useState<any>(null);
  const { homeMain, guides, eachGuide, adminInfo, guidesMain, adminDetailBox, adminDetailItem, adminLabel } = useHomeStyle();
  
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
        <h2>Admin Information</h2>
        {adminData ? (
          <div className={adminDetailBox}>
            <div className={adminDetailItem}><span className={adminLabel}>Name: </span>{adminData.name}</div>
            <div className={adminDetailItem}><span className={adminLabel}>Surname: </span>{adminData.surname}</div>
            <div className={adminDetailItem}><span className={adminLabel}>Father Name: </span>{adminData.fatherName}</div>
            <div className={adminDetailItem}><span className={adminLabel}>Username: </span>{adminData.username}</div>
            <div className={adminDetailItem}><span className={adminLabel}>Inspector ID: </span>{adminData.inspectorId}</div>
            <div className={adminDetailItem}><span className={adminLabel}>Branch Code: </span>{adminData.branchCode}</div>
            <div className={adminDetailItem}><span className={adminLabel}>Customs Code: </span>{adminData.customsCode}</div>
            <div className={adminDetailItem}><span className={adminLabel}>Access Delivery: </span>{adminData.AccessDelivery}</div>
            <div className={adminDetailItem}><span className={adminLabel}>Access GPS: </span>{adminData.AccessGps}</div>
            <div className={adminDetailItem}><span className={adminLabel}>Access Unloading: </span>{adminData.AccessUnloading}</div>
            <div className={adminDetailItem}><span className={adminLabel}>Token ID: </span>{adminData.tokenId}</div>
          </div>
        ) : (
          <p>Loading admin data...</p>
        )}
      </div>
      <div className={guidesMain}>
        <h2>Download Guides</h2>
        <div className={guides}>
          <button
            className={eachGuide}
            onClick={() => downloadPDF(pdfs.telimatAz)}
          >
            {GuideIcon()}
            Azərbaycanca təlimat
          </button>
          <br /><br />
          <button
            className={eachGuide}
            onClick={() => downloadPDF(pdfs.telimatRu)}
          >
            {GuideIcon()}
            Rusca təlimat
          </button>
          <br /><br />
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
