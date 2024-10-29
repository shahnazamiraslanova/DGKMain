

// import  { useState } from "react";
// import {
//   PlusOutlined,
// } from "@ant-design/icons";
// import { Button, Form, Input, message, Modal } from "antd";
// import axios from "axios";
// import { ICreateSection } from "../legislations";
// import { BASE_URL, getHeaders } from "baseInfos";
// import { useLegisStyle } from "../legislation.style";
// const MainLegis = () => {
//   const {
//     legislationButtons,
//     actionButton,
//     createSectionModal,
//     submitButton,
//   } = useLegisStyle();
  
//   // States
//   const [isAddSectionModalVisible, seIsAddSectionModalVisible] = useState(false);

//   const handleFinish = async (values:ICreateSection) => {
//  try {
//   const response =await axios.post(`${BASE_URL}/api/v1/Legislations/CreateSection`, { title: values.title, section_Order_Number:values.section_Order_Number },
//     {
//       headers: getHeaders()
//     });
//     seIsAddSectionModalVisible(false);
//     message.success("Bölmə yaradıldı!");
//     console.log(response.data.data);
    
    
//  } catch (error) {
//   message.error("Bölmə yaradıla bilmədi");
//  }
  
    
//   };

//   return (
//     <div style={{borderRight:'2px solid #394E75', height:'100vh', width:'50%'}}>
//       <div className={legislationButtons}>
//         <Button
//           icon={<PlusOutlined />}
//           onClick={() => seIsAddSectionModalVisible(true)}
//         //   className={actionButton}
//         >
//           Bölmə əlavə et
//         </Button>
        
//       </div>

//       <Modal
//         title="Bölmə Yarat"
//         open={isAddSectionModalVisible}
//         onCancel={() => seIsAddSectionModalVisible(false)}
//         footer={null}
//         className={createSectionModal}
//       >
//         <Form onFinish={handleFinish}>
//           <Form.Item
//             name="title"
//             label="Bölmə başlığı"
//             rules={[{ required: true, message: "Zəhmət olmasa, bölmə başlığını daxil edin" }]}
//           >
//             <Input placeholder="Bölmə başlığı..." />
//           </Form.Item>
//           <Form.Item
//             name="section_Order_Number"
//             label="Bölmə Sıra Nömrəsi"
//             rules={[{ required: true, message: "Zəhmət olmasa, bölmə sıra nömrəsini daxil edin" }]}
//           >
//             <Input placeholder="Bölmə sıra nömrəsi..." />
//           </Form.Item>
//           <Form.Item>
//             <Button type="primary" htmlType="submit" className={submitButton}>
//               Yarat
//             </Button>
//             <Button onClick={() => seIsAddSectionModalVisible(false)}>Ləğv et</Button>
//           </Form.Item>
//         </Form>
//       </Modal>
//     </div>
//   );
// };

// export default MainLegis;
