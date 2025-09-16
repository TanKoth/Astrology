import { motion } from "framer-motion";
import { Table } from "antd";
// import { getGemstoneReport } from "../../api/Report";

export const SunTableData = ({ bhinnashtakavargaSunTableData }) => {
  const sunColumns = [
    {
      title: "",
      dataIndex: "planet",
      key: "planet",
      width: "10%",
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
      title: "Ar",
      dataIndex: "ar",
      key: "1",
      width: "5%",
    },
    {
      title: "Ta",
      dataIndex: "ta",
      key: "2",
      width: "5%",
    },
    {
      title: "Ge",
      dataIndex: "ge",
      key: "3",
      width: "5%",
    },
    {
      title: "Ca",
      dataIndex: "ca",
      key: "4",
      width: "5%",
    },
    {
      title: "Le",
      dataIndex: "le",
      key: "5",
      width: "5%",
    },
    {
      title: "Vi",
      dataIndex: "vi",
      key: "6",
      width: "5%",
    },
    {
      title: "Li",
      dataIndex: "li",
      key: "7",
      width: "5%",
    },
    {
      title: "Sc",
      dataIndex: "sc",
      key: "8",
      width: "5%",
    },
    {
      title: "Sa",
      dataIndex: "sa",
      key: "9",
      width: "5%",
    },
    {
      title: "Ca",
      dataIndex: "cap",
      key: "10",
      width: "5%",
    },
    {
      title: "Aq",
      dataIndex: "aq",
      key: "11",
      width: "5%",
    },
    {
      title: "Pi",
      dataIndex: "pi",
      key: "12",
      width: "5%",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      width: "5%",
    },
  ];

  const sunData = (bhinnashtakavargaSunTableData) => {
    if (
      !bhinnashtakavargaSunTableData ||
      !bhinnashtakavargaSunTableData?.binnashtakavargaTable ||
      !bhinnashtakavargaSunTableData?.binnashtakavargaTable?.response
    ) {
      return [];
    }

    const result =
      bhinnashtakavargaSunTableData?.binnashtakavargaTable?.response;

    // Define planet names mapping
    const planetNames = {
      sun: "Sun",
      moon: "Moon",
      mars: "Mars",
      mercury: "Mercury",
      jupiter: "Jupiter",
      venus: "Venus",
      saturn: "Saturn",
      ascendant: "Ascendant",
      Total: "Total",
    };

    // Convert the response data to table format
    const tableData = [];

    Object.keys(result).forEach((planetKey, index) => {
      const planetData = result[planetKey];
      if (Array.isArray(planetData) && planetData.length === 12) {
        const total =
          planetKey === "Total"
            ? "" // or you could use null or "-"
            : planetData.reduce((sum, value) => sum + value, 0);
        tableData.push({
          key: index,
          planet: planetNames[planetKey] || planetKey,
          ar: planetData[0],
          ta: planetData[1],
          ge: planetData[2],
          ca: planetData[3],
          le: planetData[4],
          vi: planetData[5],
          li: planetData[6],
          sc: planetData[7],
          sa: planetData[8],
          cap: planetData[9],
          aq: planetData[10],
          pi: planetData[11],
          total: total,
        });
      }
    });

    return tableData;
  };

  return (
    <motion.div
      className="bhinnashtakavarga-details-table"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Table
        columns={sunColumns}
        dataSource={sunData(bhinnashtakavargaSunTableData)}
        pagination={false}
        bordered
        size="middle"
        className="bhinnashtakavarga-table"
        scroll={{ x: 800 }}
      />
    </motion.div>
  );
};
// Moon Table Component
export const MoonTableData = ({ bhinnashtakavargaMoonTableData }) => {
  const moonColumns = [
    {
      title: "",
      dataIndex: "planet",
      key: "planet",
      width: "10%",
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
      title: "Ar",
      dataIndex: "ar",
      key: "1",
      width: "5%",
    },
    {
      title: "Ta",
      dataIndex: "ta",
      key: "2",
      width: "5%",
    },
    {
      title: "Ge",
      dataIndex: "ge",
      key: "3",
      width: "5%",
    },
    {
      title: "Ca",
      dataIndex: "ca",
      key: "4",
      width: "5%",
    },
    {
      title: "Le",
      dataIndex: "le",
      key: "5",
      width: "5%",
    },
    {
      title: "Vi",
      dataIndex: "vi",
      key: "6",
      width: "5%",
    },
    {
      title: "Li",
      dataIndex: "li",
      key: "7",
      width: "5%",
    },
    {
      title: "Sc",
      dataIndex: "sc",
      key: "8",
      width: "5%",
    },
    {
      title: "Sa",
      dataIndex: "sa",
      key: "9",
      width: "5%",
    },
    {
      title: "Ca",
      dataIndex: "cap",
      key: "10",
      width: "5%",
    },
    {
      title: "Aq",
      dataIndex: "aq",
      key: "11",
      width: "5%",
    },
    {
      title: "Pi",
      dataIndex: "pi",
      key: "12",
      width: "5%",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      width: "5%",
    },
  ];

  const moonData = (bhinnashtakavargaMoonTableData) => {
    if (
      !bhinnashtakavargaMoonTableData ||
      !bhinnashtakavargaMoonTableData?.binnashtakavargaTable ||
      !bhinnashtakavargaMoonTableData?.binnashtakavargaTable?.response
    ) {
      return [];
    }

    const result =
      bhinnashtakavargaMoonTableData?.binnashtakavargaTable?.response;

    // Define planet names mapping
    const planetNames = {
      sun: "Sun",
      moon: "Moon",
      mars: "Mars",
      mercury: "Mercury",
      jupiter: "Jupiter",
      venus: "Venus",
      saturn: "Saturn",
      ascendant: "Ascendant",
      Total: "Total",
    };

    // Convert the response data to table format
    const tableData = [];

    Object.keys(result).forEach((planetKey, index) => {
      const planetData = result[planetKey];
      if (Array.isArray(planetData) && planetData.length === 12) {
        const total =
          planetKey === "Total"
            ? "" // or you could use null or "-"
            : planetData.reduce((sum, value) => sum + value, 0);
        tableData.push({
          key: index,
          planet: planetNames[planetKey] || planetKey,
          ar: planetData[0],
          ta: planetData[1],
          ge: planetData[2],
          ca: planetData[3],
          le: planetData[4],
          vi: planetData[5],
          li: planetData[6],
          sc: planetData[7],
          sa: planetData[8],
          cap: planetData[9],
          aq: planetData[10],
          pi: planetData[11],
          total: total,
        });
      }
    });

    return tableData;
  };

  return (
    <motion.div
      className="bhinnashtakavarga-details-table"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Table
        columns={moonColumns}
        dataSource={moonData(bhinnashtakavargaMoonTableData)}
        pagination={false}
        bordered
        size="middle"
        className="bhinnashtakavarga-table"
        scroll={{ x: 800 }}
      />
    </motion.div>
  );
};

// Mars Table Component
export const MarsTableData = ({ bhinnashtakavargaMarsTableData }) => {
  const marsColumns = [
    {
      title: "",
      dataIndex: "planet",
      key: "planet",
      width: "10%",
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
      title: "Ar",
      dataIndex: "ar",
      key: "1",
      width: "5%",
    },
    {
      title: "Ta",
      dataIndex: "ta",
      key: "2",
      width: "5%",
    },
    {
      title: "Ge",
      dataIndex: "ge",
      key: "3",
      width: "5%",
    },
    {
      title: "Ca",
      dataIndex: "ca",
      key: "4",
      width: "5%",
    },
    {
      title: "Le",
      dataIndex: "le",
      key: "5",
      width: "5%",
    },
    {
      title: "Vi",
      dataIndex: "vi",
      key: "6",
      width: "5%",
    },
    {
      title: "Li",
      dataIndex: "li",
      key: "7",
      width: "5%",
    },
    {
      title: "Sc",
      dataIndex: "sc",
      key: "8",
      width: "5%",
    },
    {
      title: "Sa",
      dataIndex: "sa",
      key: "9",
      width: "5%",
    },
    {
      title: "Ca",
      dataIndex: "cap",
      key: "10",
      width: "5%",
    },
    {
      title: "Aq",
      dataIndex: "aq",
      key: "11",
      width: "5%",
    },
    {
      title: "Pi",
      dataIndex: "pi",
      key: "12",
      width: "5%",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      width: "5%",
    },
  ];

  const marsData = (bhinnashtakavargaMarsTableData) => {
    if (
      !bhinnashtakavargaMarsTableData ||
      !bhinnashtakavargaMarsTableData?.binnashtakavargaTable ||
      !bhinnashtakavargaMarsTableData?.binnashtakavargaTable?.response
    ) {
      return [];
    }

    const result =
      bhinnashtakavargaMarsTableData?.binnashtakavargaTable?.response;

    // Define planet names mapping
    const planetNames = {
      sun: "Sun",
      moon: "Moon",
      mars: "Mars",
      mercury: "Mercury",
      jupiter: "Jupiter",
      venus: "Venus",
      saturn: "Saturn",
      ascendant: "Ascendant",
      Total: "Total",
    };

    // Convert the response data to table format
    const tableData = [];

    Object.keys(result).forEach((planetKey, index) => {
      const planetData = result[planetKey];
      if (Array.isArray(planetData) && planetData.length === 12) {
        const total =
          planetKey === "Total"
            ? "" // or you could use null or "-"
            : planetData.reduce((sum, value) => sum + value, 0);
        tableData.push({
          key: index,
          planet: planetNames[planetKey] || planetKey,
          ar: planetData[0],
          ta: planetData[1],
          ge: planetData[2],
          ca: planetData[3],
          le: planetData[4],
          vi: planetData[5],
          li: planetData[6],
          sc: planetData[7],
          sa: planetData[8],
          cap: planetData[9],
          aq: planetData[10],
          pi: planetData[11],
          total: total,
        });
      }
    });

    return tableData;
  };

  return (
    <motion.div
      className="bhinnashtakavarga-details-table"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Table
        columns={marsColumns}
        dataSource={marsData(bhinnashtakavargaMarsTableData)}
        pagination={false}
        bordered
        size="middle"
        className="bhinnashtakavarga-table"
        scroll={{ x: 800 }}
      />
    </motion.div>
  );
};

// Mercury Table Component
export const MercuryTableData = ({ bhinnashtakavargaMercuryTableData }) => {
  const mercuryColumns = [
    {
      title: "",
      dataIndex: "planet",
      key: "planet",
      width: "10%",
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
      title: "Ar",
      dataIndex: "ar",
      key: "1",
      width: "5%",
    },
    {
      title: "Ta",
      dataIndex: "ta",
      key: "2",
      width: "5%",
    },
    {
      title: "Ge",
      dataIndex: "ge",
      key: "3",
      width: "5%",
    },
    {
      title: "Ca",
      dataIndex: "ca",
      key: "4",
      width: "5%",
    },
    {
      title: "Le",
      dataIndex: "le",
      key: "5",
      width: "5%",
    },
    {
      title: "Vi",
      dataIndex: "vi",
      key: "6",
      width: "5%",
    },
    {
      title: "Li",
      dataIndex: "li",
      key: "7",
      width: "5%",
    },
    {
      title: "Sc",
      dataIndex: "sc",
      key: "8",
      width: "5%",
    },
    {
      title: "Sa",
      dataIndex: "sa",
      key: "9",
      width: "5%",
    },
    {
      title: "Ca",
      dataIndex: "cap",
      key: "10",
      width: "5%",
    },
    {
      title: "Aq",
      dataIndex: "aq",
      key: "11",
      width: "5%",
    },
    {
      title: "Pi",
      dataIndex: "pi",
      key: "12",
      width: "5%",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      width: "5%",
    },
  ];

  const mercuryData = (bhinnashtakavargaMercuryTableData) => {
    if (
      !bhinnashtakavargaMercuryTableData ||
      !bhinnashtakavargaMercuryTableData?.binnashtakavargaTable ||
      !bhinnashtakavargaMercuryTableData?.binnashtakavargaTable?.response
    ) {
      return [];
    }

    const result =
      bhinnashtakavargaMercuryTableData?.binnashtakavargaTable?.response;

    // Define planet names mapping
    const planetNames = {
      sun: "Sun",
      moon: "Moon",
      mars: "Mars",
      mercury: "Mercury",
      jupiter: "Jupiter",
      venus: "Venus",
      saturn: "Saturn",
      ascendant: "Ascendant",
      Total: "Total",
    };

    // Convert the response data to table format
    const tableData = [];

    Object.keys(result).forEach((planetKey, index) => {
      const planetData = result[planetKey];
      if (Array.isArray(planetData) && planetData.length === 12) {
        const total =
          planetKey === "Total"
            ? "" // or you could use null or "-"
            : planetData.reduce((sum, value) => sum + value, 0);
        tableData.push({
          key: index,
          planet: planetNames[planetKey] || planetKey,
          ar: planetData[0],
          ta: planetData[1],
          ge: planetData[2],
          ca: planetData[3],
          le: planetData[4],
          vi: planetData[5],
          li: planetData[6],
          sc: planetData[7],
          sa: planetData[8],
          cap: planetData[9],
          aq: planetData[10],
          pi: planetData[11],
          total: total,
        });
      }
    });

    return tableData;
  };

  return (
    <motion.div
      className="bhinnashtakavarga-details-table"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Table
        columns={mercuryColumns}
        dataSource={mercuryData(bhinnashtakavargaMercuryTableData)}
        pagination={false}
        bordered
        size="middle"
        className="bhinnashtakavarga-table"
        scroll={{ x: 800 }}
      />
    </motion.div>
  );
};

// Jupiter Table Component
export const JupiterTableData = ({ bhinnashtakavargaJupiterTableData }) => {
  const jupiterColumns = [
    {
      title: "",
      dataIndex: "planet",
      key: "planet",
      width: "10%",
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
      title: "Ar",
      dataIndex: "ar",
      key: "1",
      width: "5%",
    },
    {
      title: "Ta",
      dataIndex: "ta",
      key: "2",
      width: "5%",
    },
    {
      title: "Ge",
      dataIndex: "ge",
      key: "3",
      width: "5%",
    },
    {
      title: "Ca",
      dataIndex: "ca",
      key: "4",
      width: "5%",
    },
    {
      title: "Le",
      dataIndex: "le",
      key: "5",
      width: "5%",
    },
    {
      title: "Vi",
      dataIndex: "vi",
      key: "6",
      width: "5%",
    },
    {
      title: "Li",
      dataIndex: "li",
      key: "7",
      width: "5%",
    },
    {
      title: "Sc",
      dataIndex: "sc",
      key: "8",
      width: "5%",
    },
    {
      title: "Sa",
      dataIndex: "sa",
      key: "9",
      width: "5%",
    },
    {
      title: "Ca",
      dataIndex: "cap",
      key: "10",
      width: "5%",
    },
    {
      title: "Aq",
      dataIndex: "aq",
      key: "11",
      width: "5%",
    },
    {
      title: "Pi",
      dataIndex: "pi",
      key: "12",
      width: "5%",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      width: "5%",
    },
  ];

  const jupiterData = (bhinnashtakavargaJupiterTableData) => {
    if (
      !bhinnashtakavargaJupiterTableData ||
      !bhinnashtakavargaJupiterTableData?.binnashtakavargaTable ||
      !bhinnashtakavargaJupiterTableData?.binnashtakavargaTable?.response
    ) {
      return [];
    }

    const result =
      bhinnashtakavargaJupiterTableData?.binnashtakavargaTable?.response;

    // Define planet names mapping
    const planetNames = {
      sun: "Sun",
      moon: "Moon",
      mars: "Mars",
      mercury: "Mercury",
      jupiter: "Jupiter",
      venus: "Venus",
      saturn: "Saturn",
      ascendant: "Ascendant",
      Total: "Total",
    };

    // Convert the response data to table format
    const tableData = [];

    Object.keys(result).forEach((planetKey, index) => {
      const planetData = result[planetKey];
      if (Array.isArray(planetData) && planetData.length === 12) {
        const total =
          planetKey === "Total"
            ? "" // or you could use null or "-"
            : planetData.reduce((sum, value) => sum + value, 0);
        tableData.push({
          key: index,
          planet: planetNames[planetKey] || planetKey,
          ar: planetData[0],
          ta: planetData[1],
          ge: planetData[2],
          ca: planetData[3],
          le: planetData[4],
          vi: planetData[5],
          li: planetData[6],
          sc: planetData[7],
          sa: planetData[8],
          cap: planetData[9],
          aq: planetData[10],
          pi: planetData[11],
          total: total,
        });
      }
    });

    return tableData;
  };

  return (
    <motion.div
      className="bhinnashtakavarga-details-table"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Table
        columns={jupiterColumns}
        dataSource={jupiterData(bhinnashtakavargaJupiterTableData)}
        pagination={false}
        bordered
        size="middle"
        className="bhinnashtakavarga-table"
        scroll={{ x: 800 }}
      />
    </motion.div>
  );
};

// Venus Table Component
export const VenusTableData = ({ bhinnashtakavargaVenusTableData }) => {
  const venusColumns = [
    {
      title: "",
      dataIndex: "planet",
      key: "planet",
      width: "10%",
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
      title: "Ar",
      dataIndex: "ar",
      key: "1",
      width: "5%",
    },
    {
      title: "Ta",
      dataIndex: "ta",
      key: "2",
      width: "5%",
    },
    {
      title: "Ge",
      dataIndex: "ge",
      key: "3",
      width: "5%",
    },
    {
      title: "Ca",
      dataIndex: "ca",
      key: "4",
      width: "5%",
    },
    {
      title: "Le",
      dataIndex: "le",
      key: "5",
      width: "5%",
    },
    {
      title: "Vi",
      dataIndex: "vi",
      key: "6",
      width: "5%",
    },
    {
      title: "Li",
      dataIndex: "li",
      key: "7",
      width: "5%",
    },
    {
      title: "Sc",
      dataIndex: "sc",
      key: "8",
      width: "5%",
    },
    {
      title: "Sa",
      dataIndex: "sa",
      key: "9",
      width: "5%",
    },
    {
      title: "Ca",
      dataIndex: "cap",
      key: "10",
      width: "5%",
    },
    {
      title: "Aq",
      dataIndex: "aq",
      key: "11",
      width: "5%",
    },
    {
      title: "Pi",
      dataIndex: "pi",
      key: "12",
      width: "5%",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      width: "5%",
    },
  ];

  const venusData = (bhinnashtakavargaVenusTableData) => {
    if (
      !bhinnashtakavargaVenusTableData ||
      !bhinnashtakavargaVenusTableData?.binnashtakavargaTable ||
      !bhinnashtakavargaVenusTableData?.binnashtakavargaTable?.response
    ) {
      return [];
    }

    const result =
      bhinnashtakavargaVenusTableData?.binnashtakavargaTable?.response;

    // Define planet names mapping
    const planetNames = {
      sun: "Sun",
      moon: "Moon",
      mars: "Mars",
      mercury: "Mercury",
      jupiter: "Jupiter",
      venus: "Venus",
      saturn: "Saturn",
      ascendant: "Ascendant",
      Total: "Total",
    };

    // Convert the response data to table format
    const tableData = [];

    Object.keys(result).forEach((planetKey, index) => {
      const planetData = result[planetKey];
      if (Array.isArray(planetData) && planetData.length === 12) {
        const total =
          planetKey === "Total"
            ? "" // or you could use null or "-"
            : planetData.reduce((sum, value) => sum + value, 0);
        tableData.push({
          key: index,
          planet: planetNames[planetKey] || planetKey,
          ar: planetData[0],
          ta: planetData[1],
          ge: planetData[2],
          ca: planetData[3],
          le: planetData[4],
          vi: planetData[5],
          li: planetData[6],
          sc: planetData[7],
          sa: planetData[8],
          cap: planetData[9],
          aq: planetData[10],
          pi: planetData[11],
          total: total,
        });
      }
    });

    return tableData;
  };

  return (
    <motion.div
      className="bhinnashtakavarga-details-table"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Table
        columns={venusColumns}
        dataSource={venusData(bhinnashtakavargaVenusTableData)}
        pagination={false}
        bordered
        size="middle"
        className="bhinnashtakavarga-table"
        scroll={{ x: 800 }}
      />
    </motion.div>
  );
};

// Saturn Table Component
export const SaturnTableData = ({ bhinnashtakavargaSaturnTableData }) => {
  const saturnColumns = [
    {
      title: "",
      dataIndex: "planet",
      key: "planet",
      width: "10%",
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
      title: "Ar",
      dataIndex: "ar",
      key: "1",
      width: "5%",
    },
    {
      title: "Ta",
      dataIndex: "ta",
      key: "2",
      width: "5%",
    },
    {
      title: "Ge",
      dataIndex: "ge",
      key: "3",
      width: "5%",
    },
    {
      title: "Ca",
      dataIndex: "ca",
      key: "4",
      width: "5%",
    },
    {
      title: "Le",
      dataIndex: "le",
      key: "5",
      width: "5%",
    },
    {
      title: "Vi",
      dataIndex: "vi",
      key: "6",
      width: "5%",
    },
    {
      title: "Li",
      dataIndex: "li",
      key: "7",
      width: "5%",
    },
    {
      title: "Sc",
      dataIndex: "sc",
      key: "8",
      width: "5%",
    },
    {
      title: "Sa",
      dataIndex: "sa",
      key: "9",
      width: "5%",
    },
    {
      title: "Ca",
      dataIndex: "cap",
      key: "10",
      width: "5%",
    },
    {
      title: "Aq",
      dataIndex: "aq",
      key: "11",
      width: "5%",
    },
    {
      title: "Pi",
      dataIndex: "pi",
      key: "12",
      width: "5%",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      width: "5%",
    },
  ];

  const saturnData = (bhinnashtakavargaSaturnTableData) => {
    if (
      !bhinnashtakavargaSaturnTableData ||
      !bhinnashtakavargaSaturnTableData?.binnashtakavargaTable ||
      !bhinnashtakavargaSaturnTableData?.binnashtakavargaTable?.response
    ) {
      return [];
    }

    const result =
      bhinnashtakavargaSaturnTableData?.binnashtakavargaTable?.response;

    // Define planet names mapping
    const planetNames = {
      sun: "Sun",
      moon: "Moon",
      mars: "Mars",
      mercury: "Mercury",
      jupiter: "Jupiter",
      venus: "Venus",
      saturn: "Saturn",
      ascendant: "Ascendant",
      Total: "Total",
    };

    // Convert the response data to table format
    const tableData = [];

    Object.keys(result).forEach((planetKey, index) => {
      const planetData = result[planetKey];
      if (Array.isArray(planetData) && planetData.length === 12) {
        const total =
          planetKey === "Total"
            ? "" // or you could use null or "-"
            : planetData.reduce((sum, value) => sum + value, 0);
        tableData.push({
          key: index,
          planet: planetNames[planetKey] || planetKey,
          ar: planetData[0],
          ta: planetData[1],
          ge: planetData[2],
          ca: planetData[3],
          le: planetData[4],
          vi: planetData[5],
          li: planetData[6],
          sc: planetData[7],
          sa: planetData[8],
          cap: planetData[9],
          aq: planetData[10],
          pi: planetData[11],
          total: total,
        });
      }
    });

    return tableData;
  };

  return (
    <motion.div
      className="bhinnashtakavarga-details-table"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Table
        columns={saturnColumns}
        dataSource={saturnData(bhinnashtakavargaSaturnTableData)}
        pagination={false}
        bordered
        size="middle"
        className="bhinnashtakavarga-table"
        scroll={{ x: 800 }}
      />
    </motion.div>
  );
};
