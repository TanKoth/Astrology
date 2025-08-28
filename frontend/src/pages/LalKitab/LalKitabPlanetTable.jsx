import { motion } from "framer-motion";
import { Table } from "antd";

export const LalKitabPlanetTable = ({ lalkitabPlanetData }) => {
  const columns = [
    {
      title: "",
      dataIndex: "planet",
      key: "planet",
      width: "15%",
      fixed: "left",
      className: "planet-column-sticky",
      render: (text) => (
        <span
          style={{
            fontWeight: "bold",
            fontSize: "18px",
            color: "black",
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: "Rashi",
      dataIndex: "rashi",
      key: "rashi",
      width: "15%",
    },
    {
      title: "Soya",
      dataIndex: "soya",
      key: "soya",
      width: "15%",
    },
    {
      title: "Position",
      dataIndex: "position",
      key: "position",
      width: "15%",
    },
    {
      title: "Nature",
      dataIndex: "nature",
      key: "nature",
      width: "15%",
    },
  ];

  const planetData = (lalkitabPlanetData) => {
    if (
      !lalkitabPlanetData ||
      !lalkitabPlanetData?.lalkitabPlanets ||
      !lalkitabPlanetData?.lalkitabPlanets?.response
    ) {
      return null;
    }

    const result = lalkitabPlanetData?.lalkitabPlanets?.response;
    if (Array.isArray(result)) {
      return result.map((item, index) => ({
        key: index,
        planet: item.planet,
        rashi: item.rashi,
        soya: item.soya ? "Yes" : "No",
        position: item.position,
        nature: item.nature,
      }));
    }
    return null;
  };

  return (
    <motion.div
      className="lalkitab-details-table"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Table
        columns={columns}
        dataSource={planetData(lalkitabPlanetData)}
        pagination={false}
        bordered
        size="middle"
        className="lalkitab-table"
        scroll={{ x: 800 }}
      />
    </motion.div>
  );
};
