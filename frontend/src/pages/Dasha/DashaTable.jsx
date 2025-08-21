import { motion } from "framer-motion";
import { Table, Button } from "antd";
import { useState } from "react";

export const DashaTable = ({ dashaData }) => {
  const [currentView, setCurrentView] = useState("mahadasha");
  const [selectedMahadasha, setSelectedMahadasha] = useState(null);
  const [selectedAntardasha, setSelectedAntardasha] = useState(null);
  const [selectedParyantardasha, setSelectedParyantardasha] = useState(null);
  const [selectedShookshamadasha, setSelectedShookshamadasha] = useState(null);
  const [selectedPranadasha, setSelectedPranadasha] = useState(null);
  const [breadcrumb, setBreadcrumb] = useState(["Mahadasha"]);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "20%",
    },
    {
      title: "Start",
      dataIndex: "start",
      key: "start",
      width: "30%",
    },
    {
      title: "End",
      dataIndex: "end",
      key: "end",
      width: "30%",
    },
    // {
    //   key: "action",
    //   width: "20%",
    //   render: (_, record) =>
    //     currentView === "mahadasha" ? (
    //       <Button type="link" onClick={() => handleRowClick(record)}></Button>
    //     ) : currentView === "antardasha" ? (
    //       <Button type="link" onClick={() => handleRowClick(record)}></Button>
    //     ) : currentView === "paryantardasha" ? (
    //       <Button type="link" onClick={() => handleRowClick(record)}></Button>
    //     ) : currentView === "shookshamadasha" ? (
    //       <Button type="link" onClick={() => handleRowClick(record)}></Button>
    //     ) : null,
    // },
  ];

  const handleRowClick = (record) => {
    if (currentView === "mahadasha") {
      setSelectedMahadasha(record);
      setCurrentView("antardasha");
      setBreadcrumb(["Anatardasha", `${record.name}`]);
    } else if (currentView === "antardasha") {
      setSelectedAntardasha(record);
      setCurrentView("paryantardasha");
      setBreadcrumb([
        "Paryantardasha",
        `${selectedMahadasha.name}/${record.name}`,
      ]);
    } else if (currentView === "paryantardasha") {
      setSelectedParyantardasha(record);
      setCurrentView("shookshamadasha");
      setBreadcrumb([
        "Shookshamadasha",
        `${selectedMahadasha.name}/${selectedAntardasha.name}/${record.name}`,
      ]);
    } else if (currentView === "shookshamadasha") {
      setSelectedShookshamadasha(record);
      setCurrentView("pranadasha");
      setBreadcrumb([
        "Pranadasha",
        `${selectedMahadasha.name}/${selectedAntardasha.name}/${selectedParyantardasha.name}/${record.name}`,
      ]);
    }
  };

  const handleBackToMahadasha = () => {
    // setCurrentView("mahadasha");
    // setSelectedMahadasha(null);
    // setBreadcrumb(["Mahadasha"]);

    if (currentView === "antardasha") {
      setCurrentView("mahadasha");
      setSelectedMahadasha(null);
      setSelectedAntardasha(null);
      setBreadcrumb(["Mahadasha"]);
    } else if (currentView === "paryantardasha") {
      setCurrentView("antardasha");
      setSelectedAntardasha(null);
      setSelectedParyantardasha(null);
      setBreadcrumb(["Antardasha", `${selectedMahadasha.name}`]);
    } else if (currentView === "shookshamadasha") {
      setCurrentView("paryantardasha");
      setSelectedParyantardasha(null);
      setSelectedShookshamadasha(null);
      setBreadcrumb([
        "Paryantardasha",
        `${selectedMahadasha.name}/${selectedAntardasha.name}`,
      ]);
    } else if (currentView === "pranadasha") {
      setCurrentView("shookshamadasha");
      setSelectedShookshamadasha(null);
      setSelectedPranadasha(null);
      setBreadcrumb([
        "Shookshamadasha",
        `${selectedMahadasha.name}/${selectedAntardasha.name}/${selectedParyantardasha.name}`,
      ]);
    }
  };

  const getCurrentData = () => {
    if (currentView === "mahadasha") {
      return dashaData?.dashaReport?.response?.mahadasha || [];
    } else if (currentView === "antardasha") {
      // Filter antardasha based on selected mahadasha period
      const antardashaData = dashaData?.dashaReport?.response?.antardasha || [];
      if (selectedMahadasha) {
        const startDate = new Date(selectedMahadasha.start);
        const endDate = new Date(selectedMahadasha.end);
        return antardashaData.filter((item) => {
          const itemStart = new Date(item.start);
          return itemStart >= startDate && itemStart <= endDate;
        });
      }
      return antardashaData;
    } else if (currentView === "paryantardasha") {
      // Filter paryantardasha based on selected antardasha period
      const paryantardashaData =
        dashaData?.dashaReport?.response?.paryantardasha || [];
      if (selectedAntardasha) {
        const startDate = new Date(selectedAntardasha.start);
        const endDate = new Date(selectedAntardasha.end);
        return paryantardashaData.filter((item) => {
          const itemStart = new Date(item.start);
          return itemStart >= startDate && itemStart <= endDate;
        });
      }
      return paryantardashaData;
    } else if (currentView === "shookshamadasha") {
      // Filter Shookshamadasha based on selected paryantardasha period
      const shookshamadashaData =
        dashaData?.dashaReport?.response?.Shookshamadasha || [];
      if (selectedParyantardasha) {
        const startDate = new Date(selectedParyantardasha.start);
        const endDate = new Date(selectedParyantardasha.end);
        return shookshamadashaData.filter((item) => {
          const itemStart = new Date(item.start);
          return itemStart >= startDate && itemStart <= endDate;
        });
      }
      return shookshamadashaData;
    } else if (currentView === "pranadasha") {
      // Filter Pranadasha based on selected shookshamadasha period
      const pranadashaData = dashaData?.dashaReport?.response?.Pranadasha || [];
      if (selectedShookshamadasha) {
        const startDate = new Date(selectedShookshamadasha.start);
        const endDate = new Date(selectedShookshamadasha.end);
        return pranadashaData.filter((item) => {
          const itemStart = new Date(item.start);
          return itemStart >= startDate && itemStart <= endDate;
        });
      }
      return pranadashaData;
    }

    return [];
  };

  // const getTableTitle = () => {
  //   if (currentView === "mahadasha") {
  //     return "Mahadasha Periods";
  //   } else if (currentView === "antardasha") {
  //     return `Antardasha Periods for ${selectedMahadasha?.name || ""}`;
  //   }
  //   return "";
  // };

  const isClickable = () => {
    return currentView !== "pranadasha"; // Last level, no further drilling
  };

  return (
    <motion.div
      className="dasha-details-table"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Breadcrumb Navigation */}
      <div style={{ marginBottom: 16 }}>
        {breadcrumb.map((item, index) => (
          <span key={index}>
            {index > 0 && " > "}
            {index === breadcrumb.length - 1 ? (
              <strong>{item}</strong>
            ) : (
              <Button
                type="link"
                onClick={handleBackToMahadasha}
                style={{ padding: 0 }}
              >
                {item}
              </Button>
            )}
          </span>
        ))}
      </div>

      <Table
        columns={columns}
        dataSource={getCurrentData()}
        rowKey="name"
        // title={() => getTableTitle()}
        pagination={false}
        className="dasha-table"
        scroll={{ x: 800 }}
        onRow={(record) => ({
          style: {
            cursor: isClickable() ? "pointer" : "default",
          },
          onClick: () => isClickable() && handleRowClick(record),
        })}
      />
    </motion.div>
  );
};
