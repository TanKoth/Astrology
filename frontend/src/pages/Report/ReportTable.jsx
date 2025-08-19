import { motion } from "framer-motion";
import { Table } from "antd";
import { getGemstoneReport } from "../../api/Report";

export const GemstoneTable = ({ gemstoneData }) => {
  const gemStoneColumns = [
    {
      title: "Life Stone",
      dataIndex: "lifeStone",
      key: "lifeStone",
      width: "8%",
    },
    {
      title: "Lucky Stone",
      dataIndex: "luckyStone",
      key: "luckyStone",
      width: "8%",
    },
    {
      title: "Fortune Stone",
      dataIndex: "fortuneStone",
      key: "fortuneStone",
      width: "8%",
    },
    {
      title: "Benific Stone",
      dataIndex: "benificStone",
      key: "benificStone",
      width: "8%",
    },
    {
      title: "Finger",
      dataIndex: "finger",
      key: "finger",
      width: "5%",
    },
    {
      title: "Weight",
      dataIndex: "weight",
      key: "weight",
      width: "10%",
    },
    {
      title: "Day",
      dataIndex: "day",
      key: "day",
      width: "5%",
    },
    {
      title: "Metal",
      dataIndex: "metal",
      key: "metal",
      width: "8%",
    },
    {
      title: "Good Results",
      dataIndex: "goodResults",
      key: "goodResults",
      width: "10%",
    },
    {
      title: "Disease Cure",
      dataIndex: "diseaseCure",
      key: "diseaseCure",
      width: "10%",
    },
    {
      title: "Not To Wear With",
      dataIndex: "notToWearWith",
      key: "notToWearWith",
      width: "10%",
    },
  ];
  const gemstoneTableData = (gemstoneData) => {
    if (
      !gemstoneData ||
      !gemstoneData?.gemstoneReport ||
      !gemstoneData?.gemstoneReport?.response
    ) {
      return null;
    }

    const gemstoneReport = gemstoneData.gemstoneReport.response;
    let data = null;
    if (getGemstoneReport) {
      if (Array.isArray(data)) {
        data = gemstoneReport[0];
      }
      if (typeof gemstoneReport === "object" && gemstoneReport !== null) {
        data = gemstoneReport;
      }
      return [
        {
          key: 0,
          lifeStone: data?.life_stone,
          luckyStone: data?.lucky_stone,
          fortuneStone: data?.fortune_stone,
          benificStone: data?.name,
          finger: data?.finger,
          weight: data?.weight,
          day: data?.day,
          metal: data?.metal,
          goodResults: data?.good_results.map((goodResults, index) => (
            <ul key={index}>
              <li>{goodResults}</li>
            </ul>
          )),
          diseaseCure: data?.diseases_cure.map((diseaseCure, index) => (
            <ul key={index}>
              <li>{diseaseCure}</li>
            </ul>
          )),
          notToWearWith: data?.not_to_wear_with.map((notToWearWith, index) => (
            <ul key={index}>
              <li>{notToWearWith}</li>
            </ul>
          )),
        },
      ];
    }
  };
  return (
    <motion.div
      className="favorable-details-table"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Table
        columns={gemStoneColumns}
        dataSource={gemstoneTableData(gemstoneData)}
        pagination={false}
        bordered
        size="middle"
        className="favorable-table"
        scroll={{ x: 800 }}
      />
    </motion.div>
  );
};

export const RudrakshTable = ({ rudrakshData }) => {
  const rudrakshColumns = [
    {
      title: "Rudraksh",
      dataIndex: "rudraksh",
      key: "rudraksh",
      width: "10%",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "10%",
    },
    {
      title: "Qualities",
      dataIndex: "qualities",
      key: "qualities",
      width: "10%",
    },
    {
      title: "How To Wear",
      dataIndex: "howToWear",
      key: "howToWear",
      width: "10%",
    },
    {
      title: "Time To Wear",
      dataIndex: "timeToWear",
      key: "timeToWear",
      width: "10%",
    },
  ];

  const rudrakshTableData = (rudrakshData) => {
    if (
      !rudrakshData ||
      !rudrakshData?.rudrakshReport ||
      !rudrakshData?.rudrakshReport?.response
    ) {
      return null;
    }

    const rudrakshReport = rudrakshData.rudrakshReport.response;
    let data = null;
    if (rudrakshReport) {
      if (Array.isArray(data)) {
        data = rudrakshReport[0];
      }
      if (typeof rudrakshReport === "object" && rudrakshReport !== null) {
        data = rudrakshReport;
      }
    }
    return [
      {
        key: 0,
        rudraksh: data?.rudraksh,
        name: data?.name,
        qualities: data?.qualities.map((quality, index) => (
          <ul key={index}>
            <li>{quality}</li>
          </ul>
        )),
        howToWear: data?.how_to_wear,
        timeToWear: data?.time_to_wear,
      },
    ];
  };

  return (
    <motion.div
      className="favorable-details-table"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Table
        columns={rudrakshColumns}
        dataSource={rudrakshTableData(rudrakshData)}
        pagination={false}
        bordered
        size="middle"
        className="favorable-table"
        scroll={{ x: 800 }}
      />
    </motion.div>
  );
};
