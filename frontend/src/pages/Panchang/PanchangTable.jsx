import { Table } from "antd";
import { motion } from "framer-motion";

export const TithiTable = ({ panchangData }) => {
  const tithiColumns = [
    {
      title: "Name",
      dataIndex: "tithi_name",
      key: "name",
      width: "10%",
    },
    {
      title: "Diety",
      dataIndex: "diety",
      key: "diety",
      width: "10%",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: "10%",
    },
    {
      title: "Number",
      dataIndex: "number",
      key: "number",
      width: "5%",
    },
    {
      title: "Start",
      dataIndex: "start",
      key: "start",
      width: "10%",
    },
    {
      title: "End",
      dataIndex: "end",
      key: "end",
      width: "10%",
    },
    {
      title: "Next Tithi",
      dataIndex: "next_tithi",
      key: "next_tithi",
      width: "8%",
    },
    {
      title: "Meaning",
      dataIndex: "meaning",
      key: "meaning",
      width: "15%",
    },
    {
      title: "Special",
      dataIndex: "special",
      key: "special",
      width: "20%",
    },
  ];

  const nakshatraColumns = [
    {
      title: "Name",
      dataIndex: "nakshatra_name",
      key: "name",
      width: "10%",
    },
    {
      title: "Lord",
      dataIndex: "lord",
      key: "lord",
      width: "10%",
    },
    {
      title: "Words",
      dataIndex: "words",
      key: "words",
      width: "10%",
    },
    {
      title: "Diety",
      dataIndex: "diety",
      key: "diety",
      width: "10%",
    },
    {
      title: "Number",
      dataIndex: "number",
      key: "number",
      width: "1%",
    },
    {
      title: "Start",
      dataIndex: "start",
      key: "start",
      width: "10%",
    },
    {
      title: "End",
      dataIndex: "end",
      key: "end",
      width: "10%",
    },
    {
      title: "Next Nakshatra",
      dataIndex: "next_nakshatra",
      key: "next_nakshatra",
      width: "8%",
    },
    {
      title: "Meaning",
      dataIndex: "meaning",
      key: "meaning",
      width: "15%",
    },
    {
      title: "Special",
      dataIndex: "special",
      key: "special",
      width: "10%",
    },
    {
      title: "Summary",
      dataIndex: "summary",
      key: "summary",
      width: "25%",
    },
  ];

  const karanaColumns = [
    {
      title: "Name",
      dataIndex: "karana_name",
      key: "name",
      width: "10%",
    },
    {
      title: "Lord",
      dataIndex: "lord",
      key: "lord",
      width: "10%",
    },
    {
      title: "Diety",
      dataIndex: "diety",
      key: "diety",
      width: "10%",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: "10%",
    },
    {
      title: "Number",
      dataIndex: "number",
      key: "number",
      width: "5%",
    },
    {
      title: "Start",
      dataIndex: "start",
      key: "start",
      width: "10%",
    },
    {
      title: "End",
      dataIndex: "end",
      key: "end",
      width: "10%",
    },
    {
      title: "Next Karana",
      dataIndex: "next_karana",
      key: "next_karana",
      width: "8%",
    },
    {
      title: "Special",
      dataIndex: "special",
      key: "special",
      width: "20%",
    },
  ];

  const yearColumns = [
    {
      title: "Kali",
      dataIndex: "kali",
      key: "kali",
      width: "10%",
    },
    {
      title: "Kali Samvaat Name",
      dataIndex: "kali_samvaat_name",
      key: "kali_samvaat_name",
      width: "10%",
    },
    {
      title: "Kali Samvaat Number",
      dataIndex: "kali_samvaat_number",
      key: "kali_samvaat_number",
      width: "10%",
    },
    {
      title: "Saka",
      dataIndex: "saka",
      key: "saka",
      width: "10%",
    },
    {
      title: "Saka Samvaat Name",
      dataIndex: "saka_samvaat_name",
      key: "saka_samvaat_name",
      width: "10%",
    },
    {
      title: "Saka Samvaat Number",
      dataIndex: "saka_samvaat_number",
      key: "saka_samvaat_number",
      width: "10%",
    },
    {
      title: "Vikram Samvaat",
      dataIndex: "vikram_samvaat",
      key: "vikram_samvaat",
      width: "10%",
    },

    {
      title: "Vikram Samvaat Name",
      dataIndex: "vikram_samvaat_name",
      key: "vikram_samvaat_name",
      width: "10%",
    },
    {
      title: "Vikram Samvaat Number",
      dataIndex: "vikram_samvaat_number",
      key: "vikram_samvaat_number",
      width: "10%",
    },
  ];

  const tithiData = (panchangData) => {
    if (
      !panchangData ||
      !panchangData.report ||
      !panchangData.report.response ||
      !panchangData.report.response.tithi
    )
      return [];

    const response = panchangData.report.response.tithi;

    if (!Array.isArray(response)) {
      console.warn("Tithi data is not an array:", response);
      // If it's a single object, wrap it in an array
      if (typeof response === "object" && response !== null) {
        return [
          {
            key: 0,
            tithi_name: response?.name || "N/A",
            diety: response?.diety || "N/A",
            type: response?.type || "N/A",
            number: response?.number || "N/A",
            start: response?.start || "N/A",
            end: response?.end || "N/A",
            next_tithi: response?.next_tithi || "N/A",
            meaning: response?.meaning || "N/A",
            special: response?.special || "N/A",
          },
        ];
      }
      return [];
    }
  };

  const nakshatraData = (panchangData) => {
    if (
      !panchangData ||
      !panchangData.report ||
      !panchangData.report.response ||
      !panchangData.report.response.nakshatra
    )
      return [];

    const response = panchangData.report.response.nakshatra;

    if (!Array.isArray(response)) {
      console.warn("Nakshatra data is not an array:", response);
      // If it's a single object, wrap it in an array
      if (typeof response === "object" && response !== null) {
        return [
          {
            key: 0,
            nakshatra_name: response?.name || "N/A",
            lord: response?.lord || "N/A",
            words: response?.words || "N/A",
            diety: response?.diety || "N/A",
            number: response?.number || "N/A",
            start: response?.start || "N/A",
            end: response?.end || "N/A",
            next_nakshatra: response?.next_nakshatra || "N/A",
            meaning: response?.meaning || "N/A",
            special: response?.special || "N/A",
            summary: response?.summary || "N/A",
          },
        ];
      }
      return [];
    }
  };

  const karanaData = (panchangData) => {
    if (
      !panchangData ||
      !panchangData.report ||
      !panchangData.report.response ||
      !panchangData.report.response.karana
    )
      return [];

    const response = panchangData.report.response.karana;
    if (!Array.isArray(response) && response !== null) {
      return [
        {
          key: 0,
          karana_name: response?.name || "N/A",
          lord: response?.lord || "N/A",
          diety: response?.diety || "N/A",
          number: response?.number || "N/A",
          start: response?.start || "N/A",
          end: response?.end || "N/A",
          next_karana: response?.next_karana || "N/A",
          special: response?.special || "N/A",
          type: response?.type || "N/A",
        },
      ];
    }

    if (!Array.isArray(response)) {
      console.warn("Karana data is not an array:", response);
      // If it's a single object, wrap it in an array
      if (typeof response === "object" && response !== null) {
        return [
          {
            key: 0,
            karana_name: response?.name || "N/A",
            lord: response?.lord || "N/A",
            diety: response?.diety || "N/A",
            number: response?.number || "N/A",
            start: response?.start || "N/A",
            end: response?.end || "N/A",
            next_karana: response?.next_karana || "N/A",
            special: response?.special || "N/A",
          },
        ];
      }
      return [];
    }
  };

  const yearData = (panchangData) => {
    if (
      !panchangData ||
      !panchangData.report ||
      !panchangData.report.response ||
      !panchangData.report.response ||
      !panchangData.report.response.advanced_details ||
      !panchangData.report.response.advanced_details.years
    )
      return [];

    const response = panchangData.report.response.advanced_details.years;
    if (!Array.isArray(response)) {
      console.warn("Year data is not an array:", response);
      // If it's a single object, wrap it in an array
      if (typeof response === "object" && response !== null) {
        return [
          {
            key: 0,
            kali: response?.kali || "N/A",
            kali_samvaat_name: response?.kali_samvaat_name || "N/A",
            kali_samvaat_number: response?.kali_samvaat_number || "N/A",
            saka: response?.saka || "N/A",
            saka_samvaat_name: response?.saka_samvaat_name || "N/A",
            saka_samvaat_number: response?.saka_samvaat_number || "N/A",
            vikram_samvaat: response?.vikram_samvaat || "N/A",
            vikram_samvaat_name: response?.vikram_samvaat_name || "N/A",
            vikram_samvaat_number: response?.vikram_samvaat_number || "N/A",
          },
        ];
      }
      return [];
    }
  };

  return (
    <motion.div
      className="panchang-details-table"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="panchang-table-title">Tithi</h3>
      <Table
        columns={tithiColumns}
        dataSource={tithiData(panchangData)}
        pagination={false}
        bordered
        size="middle"
        className="panchang-table"
        scroll={{ x: 800 }}
      />
      <br />

      <h3 className="panchang-table-title">Nakshatra</h3>
      <Table
        columns={nakshatraColumns}
        dataSource={nakshatraData(panchangData)}
        pagination={false}
        bordered
        size="middle"
        className="panchang-table"
        scroll={{ x: 800 }}
      />
      <br />

      <h3 className="panchang-table-title">Karana</h3>
      <Table
        columns={karanaColumns}
        dataSource={karanaData(panchangData)}
        pagination={false}
        bordered
        size="middle"
        className="panchang-table"
        scroll={{ x: 800 }}
      />
      <br />

      <h3 className="panchang-table-title">Years</h3>
      <Table
        columns={yearColumns}
        dataSource={yearData(panchangData)}
        pagination={false}
        bordered
        size="middle"
        className="panchang-table"
        scroll={{ x: 800 }}
      />
    </motion.div>
  );
};
