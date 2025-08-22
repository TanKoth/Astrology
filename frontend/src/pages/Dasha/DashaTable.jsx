import { motion } from "framer-motion";
import { Table, Button } from "antd";
import { useState } from "react";
import { formateDate } from "../../utilityFunction/FetchLocationData";

export const DashaTable = ({ dashaData }) => {
  const [currentView, setCurrentView] = useState("mahadasha");
  const [selectedMahadasha, setSelectedMahadasha] = useState(null);
  const [selectedAntardasha, setSelectedAntardasha] = useState(null);
  const [selectedPratyantardasha, setSelectedPratyantardasha] = useState(null);
  const [selectedShookshamadasha, setSelectedShookshamadasha] = useState(null);
  const [selectedPranadasha, setSelectedPranadasha] = useState(null);
  const [breadcrumb, setBreadcrumb] = useState(["Mahadasha"]);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "50%",
      align: "center",
    },
    // {
    //   title: "Start",
    //   dataIndex: "start",
    //   key: "start",
    //   width: "30%",
    //   render: formateDate,
    // },
    {
      title: "End",
      dataIndex: "end",
      key: "end",
      width: "50%",
      render: formateDate,
      align: "center",
    },
  ];

  const handleRowClick = (record) => {
    if (currentView === "mahadasha") {
      setSelectedMahadasha(record);
      setCurrentView("antardasha");
      setBreadcrumb(["Mahadasha", "Antardasha"]);
    } else if (currentView === "antardasha") {
      setSelectedAntardasha(record);
      setCurrentView("pratyantardasha");
      setBreadcrumb(["Mahadasha", "Antardasha", "Pratyantardasha"]);
    }
  };

  const handleBackToMahadasha = () => {
    if (currentView === "antardasha") {
      setCurrentView("mahadasha");
      setSelectedMahadasha(null);
      setSelectedAntardasha(null);
      setBreadcrumb(["Mahadasha"]);
    } else if (currentView === "pratyantardasha") {
      setCurrentView("antardasha");
      setSelectedAntardasha(null);
      setSelectedPratyantardasha(null);
      setBreadcrumb(["Mahadasha", "Antardasha"]);
    }
  };

  const getCurrentData = () => {
    if (currentView === "mahadasha") {
      return dashaData?.data?.data?.dasha_periods || [];
    } else if (currentView === "antardasha") {
      // Filter antardasha based on selected mahadasha period
      if (selectedMahadasha) {
        // Find the selected mahadasha in the dasha_periods array
        const selectedMahadashaData =
          dashaData?.data?.data?.dasha_periods?.find(
            (period) => period.id === selectedMahadasha.id
          );
        return selectedMahadashaData?.antardasha || [];
      }
      return [];
    } else if (currentView === "pratyantardasha") {
      // Filter pratyantardasha based on selected antardasha period
      if (selectedAntardasha) {
        // First find the mahadasha
        const selectedMahadashaData =
          dashaData?.data?.data?.dasha_periods?.find(
            (period) => period.id === selectedAntardasha.id
          );
        // Then find the antardasha within that mahadasha
        const selectedAntardashaData = selectedMahadashaData?.antardasha?.find(
          (antardasha) => antardasha.id === selectedAntardasha.id
        );
        return selectedAntardashaData?.pratyantardasha || [];
      }
      return [];
    }
    return [];
  };

  const getTableTitle = () => {
    if (currentView === "mahadasha") {
      return "Mahadasha Periods";
    } else if (currentView === "antardasha") {
      return `Antardasha Periods for ${selectedMahadasha?.name || ""}`;
    } else if (currentView === "pratyantardasha") {
      return `Pratyantardasha Periods for ${selectedMahadasha?.name || ""}/${
        selectedAntardasha?.name || ""
      }`;
    }

    return "";
  };

  const isClickable = () => {
    return currentView !== "pratyantardasha"; // Last level, no further drilling
  };

  return (
    <motion.div
      className="dasha-details-table"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Breadcrumb Navigation */}
      <div className="dasha-table-title">
        {breadcrumb.map((item, index) => (
          <span key={index}>
            {index > 0 && " > "}
            {index === breadcrumb.length - 1 ? (
              <strong>{item}</strong>
            ) : (
              <Button
                type="link"
                onClick={() => {
                  if (index === 0) {
                    // Go to Mahadasha
                    setCurrentView("mahadasha");
                    setSelectedMahadasha(null);
                    setSelectedAntardasha(null);
                    setSelectedPratyantardasha(null);
                    setBreadcrumb(["Mahadasha"]);
                  } else if (index === 1) {
                    // Go to Antardasha
                    setCurrentView("antardasha");
                    setSelectedAntardasha(null);
                    setSelectedPratyantardasha(null);
                    setBreadcrumb(["Mahadasha", "Antardasha"]);
                  }
                }}
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
        title={() => (
          <div className="dasha-table-sub-title">{getTableTitle()}</div>
        )}
        pagination={false}
        bordered
        size="small"
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
