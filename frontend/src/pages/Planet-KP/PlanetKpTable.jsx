import { motion } from "framer-motion";
import { Table } from "antd";

export const PlanetKpTable = ({ kpData }) => {
  const columns = [
    {
      title: "Planet",
      dataIndex: "planet",
      key: "planet",
      width: "10%",
      alignItems: "center",
    },
    {
      title: "Local Degree",
      dataIndex: "localDegree",
      key: "localDegree",
      width: "10%",
      alignItems: "center",
      render: (text, record) => {
        return (
          //take 3 decimal places
          <span>
            {typeof record.localDegree === "number"
              ? record.localDegree.toFixed(3)
              : record.localDegree}
          </span>
        );
      },
    },
    {
      title: "Global Degree",
      dataIndex: "globalDegree",
      key: "globalDegree",
      width: "10%",
      alignItems: "center",
      render: (text, record) => {
        return (
          //take 3 decimal places
          <span>
            {typeof record.globalDegree === "number"
              ? record.globalDegree.toFixed(3)
              : record.globalDegree}
          </span>
        );
      },
    },
    {
      title: "Rasi",
      dataIndex: "rasi",
      key: "rasi",
      width: "10%",
      alignItems: "center",
    },
    {
      title: "Nakshatra",
      dataIndex: "nakshatra",
      key: "nakshatra",
      width: "10%",
      alignItems: "center",
    },
    {
      title: "Sub",
      dataIndex: "sub",
      key: "sub",
      width: "10%",
      alignItems: "center",
    },
    {
      title: "Sub-Sub",
      dataIndex: "subSub",
      key: "subSub",
      width: "10%",
      alignItems: "center",
    },
  ];

  const data = (kpData) => {
    if (
      !kpData ||
      !kpData?.planetsKpReport ||
      !kpData?.planetsKpReport?.response
    ) {
      return null;
    }

    const response = kpData?.planetsKpReport?.response;
    let responseArray;
    if (Array.isArray(response)) {
      responseArray = response;
    } else if (typeof response === "object") {
      responseArray = Object.values(response);
    } else {
      return [];
    }

    // Skip the first element (index 0) and get the rest
    const planetsData = responseArray.slice(1);

    return planetsData.map((planetData, index) => ({
      key: index, // Add unique key for React
      planet: planetData?.full_name || "N/A",
      localDegree: planetData?.local_degree ?? "N/A",
      globalDegree: planetData?.global_degree ?? "N/A",
      rasi: planetData?.pseudo_rasi_lord || "N/A",
      nakshatra: planetData?.pseudo_nakshatra_lord || "N/A",
      sub: planetData?.sub_lord || "N/A",
      subSub: planetData?.sub_sub_lord || "N/A",
    }));
  };

  return (
    <motion.div
      className="kp-details-table"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Table
        columns={columns}
        dataSource={data(kpData)}
        pagination={false}
        bordered
        size="middle"
        className="kp-table"
        scroll={{ x: 800 }}
      />
    </motion.div>
  );
};
