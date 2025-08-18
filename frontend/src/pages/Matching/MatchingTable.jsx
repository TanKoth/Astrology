import { Table } from "antd";
import { motion } from "framer-motion";
import { LocateFixed } from "lucide-react";

export const MatchingTable = ({
  matchingData,
  selectedBoyTime,
  selectedBoyDate,
  boyAddress,
  selectedGirlDate,
  selectedGirlTime,
  girlAddress,
}) => {
  const detailsColumns = [
    {
      title: "",
      dataIndex: "gender",
      key: "gender",
      width: "10%",
      fixed: "left",
      className: "gender-column-sticky",
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
      title: "Birth Date",
      dataIndex: "birthDate",
      key: "birthDate",
      width: "10%",
    },
    {
      title: "Birth Time",
      dataIndex: "birthTime",
      key: "birthTime",
      width: "10%",
    },
    {
      title: "Birth Rasi",
      dataIndex: "birthRasi",
      key: "birthRasi",
      width: "10%",
    },
    {
      title: "Birth Dasa",
      dataIndex: "birthDasa",
      key: "birthDasa",
      width: "10%",
    },
    {
      title: "Birth Dasa Time",
      dataIndex: "birthDasaTime",
      key: "birthDasaTime",
      width: "10%",
    },
    {
      title: "Current Dasa",
      dataIndex: "currentDasa",
      key: "currentDasa",
      width: "10%",
    },
    {
      title: "Current Dasa Time",
      dataIndex: "currentDasaTime",
      key: "currentDasaTime",
      width: "10%",
    },
    {
      title: "Birth Place",
      dataIndex: "birthPlace",
      key: "birthPlace",
      width: "15%",
    },
  ];

  const data = (matchingData) => {
    if (
      !matchingData ||
      !matchingData?.report ||
      !matchingData?.report?.response
    ) {
      return [];
    }

    const boyAstroDetail = matchingData?.report?.response?.boy_astro_details;
    const girlAstroDetail = matchingData?.report?.response?.girl_astro_details;

    let boyAstroData = null;
    if (boyAstroDetail) {
      if (Array.isArray(boyAstroDetail)) {
        boyAstroData = boyAstroDetail[0];
      } else if (
        typeof boyAstroDetail === "object" &&
        boyAstroDetail !== null
      ) {
        boyAstroData = boyAstroDetail;
      }
    }

    let girlAstroData = null;
    if (girlAstroDetail) {
      if (Array.isArray(girlAstroDetail)) {
        girlAstroData = girlAstroDetail[0];
      } else if (
        typeof girlAstroDetail === "object" &&
        girlAstroDetail !== null
      ) {
        girlAstroData = girlAstroDetail;
      }
    }

    return [
      // Boy data row
      {
        key: "boy",
        gender: "Boy",
        birthDate: selectedBoyDate || "N/A",
        birthTime: selectedBoyTime || "N/A",
        birthPlace: boyAddress || "N/A",
        birthRasi: boyAstroData?.rasi || "N/A",
        birthDasa: boyAstroData?.birth_dasa || "N/A",
        birthDasaTime: boyAstroData?.birth_dasa_time || "N/A",
        currentDasa: boyAstroData?.current_dasa || "N/A",
        currentDasaTime: boyAstroData?.current_dasa_time || "N/A",
      },
      // Girl data row
      {
        key: "girl",
        gender: "Girl",
        birthDate: selectedGirlDate || "N/A",
        birthTime: selectedGirlTime || "N/A",
        birthPlace: girlAddress || "N/A",
        birthRasi: girlAstroData?.rasi || "N/A",
        birthDasa: girlAstroData?.birth_dasa || "N/A",
        birthDasaTime: girlAstroData?.birth_dasa_time || "N/A",
        currentDasa: girlAstroData?.current_dasa || "N/A",
        currentDasaTime: girlAstroData?.current_dasa_time || "N/A",
      },
    ];
  };

  return (
    <motion.div
      className="nakshatra-matching-details-table"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Table
        columns={detailsColumns}
        dataSource={data(matchingData)}
        pagination={false}
        bordered
        size="middle"
        className="nakshatra-matching-table"
        scroll={{ x: 800 }}
      ></Table>
    </motion.div>
  );
};

export const AdvanceDetailsTable = ({ matchingData }) => {
  const advanceDetails = [
    {
      title: "",
      dataIndex: "gender",
      key: "gender",
      width: "5%",
      fixed: "left",
      className: "gender-column-sticky",
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
      title: "Gana",
      dataIndex: "gana",
      key: "gana",
      width: "5%",
    },
    {
      title: "Nadi",
      dataIndex: "nadi",
      key: "nandi",
      width: "5%",
    },
    {
      title: "Nakshatra",
      dataIndex: "nakshatra",
      key: "nakshatra",
      width: "5%",
    },
    {
      title: "Nakshatra Pada",
      dataIndex: "nakshatraPada",
      key: "nakshatraPada",
      width: "5%",
    },
    {
      title: "Paya",
      dataIndex: "paya",
      key: "paya",
      width: "5%",
    },
    {
      title: "Lagna Rasi",
      dataIndex: "lagnaRasi",
      key: "lagnaRasi",
      width: "5%",
    },
    {
      title: "Tatva",
      dataIndex: "tatva",
      key: "tatva",
      width: "5%",
    },
    {
      title: "Varna",
      dataIndex: "varna",
      key: "varna",
      width: "5%",
    },
    {
      title: "Vasya",
      dataIndex: "vasya",
      key: "vasya",
      width: "5%",
    },
    {
      title: "Yoni",
      dataIndex: "yoni",
      key: "yoni",
      width: "5%",
    },
  ];

  const advancedDetailsData = (matchingData) => {
    if (
      !matchingData ||
      !matchingData?.report ||
      !matchingData?.report?.response
    ) {
      return [];
    }

    const boyAstroDetail = matchingData?.report?.response?.boy_astro_details;
    const girlAstroDetail = matchingData?.report?.response?.girl_astro_details;

    let boyAstroData = null;
    if (boyAstroDetail) {
      if (Array.isArray(boyAstroDetail)) {
        boyAstroData = boyAstroDetail[0];
      } else if (
        typeof boyAstroDetail === "object" &&
        boyAstroDetail !== null
      ) {
        boyAstroData = boyAstroDetail;
      }
    }

    let girlAstroData = null;
    if (girlAstroDetail) {
      if (Array.isArray(girlAstroDetail)) {
        girlAstroData = girlAstroDetail[0];
      } else if (
        typeof girlAstroDetail === "object" &&
        girlAstroDetail !== null
      ) {
        girlAstroData = girlAstroDetail;
      }
    }

    return [
      // Boy data row
      {
        key: "boy",
        gender: "Boy",
        gana: boyAstroData?.gana || "N/A",
        nadi: boyAstroData?.nadi || "N/A",
        nakshatra: boyAstroData?.nakshatra || "N/A",
        nakshatraPada: boyAstroData?.nakshatra_pada ?? "N/A",
        paya: boyAstroData?.paya || "N/A",
        lagnaRasi: boyAstroData?.ascendant_sign || "N/A",
        tatva: boyAstroData?.tatva || "N/A",
        varna: boyAstroData?.varna || "N/A",
        vasya: boyAstroData?.vasya || "N/A",
        yoni: boyAstroData?.yoni || "N/A",
      },
      // Girl data row
      {
        key: "girl",
        gender: "Girl",
        gana: girlAstroData?.gana || "N/A",
        nadi: girlAstroData?.nadi || "N/A",
        nakshatra: girlAstroData?.nakshatra || "N/A",
        nakshatraPada: girlAstroData?.nakshatra_pada ?? "N/A",
        paya: girlAstroData?.paya || "N/A",
        lagnaRasi: girlAstroData?.ascendant_sign || "N/A",
        tatva: girlAstroData?.tatva || "N/A",
        varna: girlAstroData?.varna || "N/A",
        vasya: girlAstroData?.vasya || "N/A",
        yoni: girlAstroData?.yoni || "N/A",
      },
    ];
  };

  return (
    <motion.div
      className="nakshatra-matching-details-table"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Table
        columns={advanceDetails}
        dataSource={advancedDetailsData(matchingData)}
        pagination={false}
        bordered
        size="middle"
        className="nakshatra-matching-table"
        scroll={{ x: 800 }}
      />
    </motion.div>
  );
};

export const LuckyDetailsTable = ({ matchingData }) => {
  const luckyColumns = [
    {
      title: "",
      dataIndex: "gender",
      key: "gender",
      width: "8%",
      fixed: "left",
      className: "gender-column-sticky",
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
      title: "Colors",
      dataIndex: "colors",
      key: "colors",
      width: "15%",
    },
    {
      title: "Gems",
      dataIndex: "gems",
      key: "gems",
      width: "15%",
    },
    {
      title: "Letters",
      dataIndex: "letters",
      key: "letters",
      width: "15%",
    },
    {
      title: "Name Initials",
      dataIndex: "nameInitials",
      key: "nameInitials",
      width: "15%",
    },
    {
      title: "Number",
      dataIndex: "number",
      key: "number",
      width: "10%",
    },
  ];

  const luckyData = (matchingData) => {
    if (
      !matchingData ||
      !matchingData?.report ||
      !matchingData?.report?.response
    ) {
      return [];
    }

    const boyAstroDetail = matchingData?.report?.response?.boy_astro_details;
    const girlAstroDetail = matchingData?.report?.response?.girl_astro_details;

    let boyAstroData = null;
    if (boyAstroDetail) {
      if (Array.isArray(boyAstroDetail)) {
        boyAstroData = boyAstroDetail[0];
      } else if (
        typeof boyAstroDetail === "object" &&
        boyAstroDetail !== null
      ) {
        boyAstroData = boyAstroDetail;
      }
    }

    let girlAstroData = null;
    if (girlAstroDetail) {
      if (Array.isArray(girlAstroDetail)) {
        girlAstroData = girlAstroDetail[0];
      } else if (
        typeof girlAstroDetail === "object" &&
        girlAstroDetail !== null
      ) {
        girlAstroData = girlAstroDetail;
      }
    }

    return [
      // Boy data row
      {
        key: "boy",
        gender: "Boy",
        colors: boyAstroData?.lucky_colors || "N/A",
        gems: boyAstroData?.lucky_gem || "N/A",
        letters: boyAstroData?.lucky_letters || "N/A",
        nameInitials: boyAstroData?.lucky_name_start || "N/A",
        number: boyAstroData?.lucky_num || "N/A",
      },
      // Girl data row
      {
        key: "girl",
        gender: "Girl",
        colors: girlAstroData?.lucky_colors || "N/A",
        gems: girlAstroData?.lucky_gem || "N/A",
        letters: girlAstroData?.lucky_letters || "N/A",
        nameInitials: girlAstroData?.lucky_name_start || "N/A",
        number: girlAstroData?.lucky_num || "N/A",
      },
    ];
  };

  return (
    <motion.div
      className="nakshatra-matching-details-table"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Table
        columns={luckyColumns}
        dataSource={luckyData(matchingData)}
        pagination={false}
        bordered
        size="middle"
        className="nakshatra-matching-table"
        scroll={{ x: 800 }}
      />
    </motion.div>
  );
};

export const GunaMilanTable = ({ matchingData }) => {
  const milanColumns = [
    {
      title: "Guna",
      dataIndex: "guna",
      key: "guna",
      width: "8%",
      fixed: "left",
      className: "gender-column-sticky",
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
      title: "Boy",
      dataIndex: "boy",
      key: "boy",
      width: "10%",
    },
    {
      title: "Girl",
      dataIndex: "girl",
      key: "girl",
      width: "10%",
    },
    {
      title: "Obtained Points",
      dataIndex: "points",
      key: "points",
      width: "5%",
    },
    {
      title: "Maximum",
      dataIndex: "max",
      key: "max",
      width: "5%",
    },
    {
      title: "Area of Life",
      dataIndex: "area_of_life",
      key: "area_of_life",
      width: "10%",
    },
  ];

  const milanData = (matchingData) => {
    if (
      !matchingData ||
      !matchingData?.report ||
      !matchingData?.report?.response
    ) {
      return [];
    }

    const varna = matchingData?.report?.response?.varna;
    const vasya = matchingData?.report?.response?.vasya;
    const tara = matchingData?.report?.response?.tara;
    const yoni = matchingData?.report?.response?.yoni;
    const grahamaitri = matchingData?.report?.response?.grahamaitri;
    const gana = matchingData?.report?.response?.gana;
    const bhakoot = matchingData?.report?.response?.bhakoot;
    const nadi = matchingData?.report?.response?.nadi;

    let varnaMilan = null;
    if (varna) {
      if (Array.isArray(varna)) {
        varnaMilan = varna[0];
      } else if (typeof varna === "object" && varna !== null) {
        varnaMilan = varna;
      }
    }

    let vasyaMilan = null;
    if (vasya) {
      if (Array.isArray(vasya)) {
        vasyaMilan = vasya[0];
      } else if (typeof vasya === "object" && vasya !== null) {
        vasyaMilan = vasya;
      }
    }

    let taraMilan = null;
    if (tara) {
      if (Array.isArray(tara)) {
        taraMilan = tara[0];
      } else if (typeof tara === "object" && tara !== null) {
        taraMilan = tara;
      }
    }

    let yoniMilan = null;
    if (yoni) {
      if (Array.isArray(yoni)) {
        yoniMilan = yoni[0];
      } else if (typeof yoni === "object" && yoni !== null) {
        yoniMilan = yoni;
      }
    }

    let grahamaitriMilan = null;
    if (grahamaitri) {
      if (Array.isArray(grahamaitri)) {
        grahamaitriMilan = grahamaitri[0];
      } else if (typeof grahamaitri === "object" && grahamaitri !== null) {
        grahamaitriMilan = grahamaitri;
      }
    }

    let ganaMilan = null;
    if (gana) {
      if (Array.isArray(gana)) {
        ganaMilan = gana[0];
      } else if (typeof gana === "object" && gana !== null) {
        ganaMilan = gana;
      }
    }

    let bhakootMilan = null;
    if (bhakoot) {
      if (Array.isArray(bhakoot)) {
        bhakootMilan = bhakoot[0];
      } else if (typeof bhakoot === "object" && bhakoot !== null) {
        bhakootMilan = bhakoot;
      }
    }

    let nadiMilan = null;
    if (nadi) {
      if (Array.isArray(nadi)) {
        nadiMilan = nadi[0];
      } else if (typeof nadi === "object" && nadi !== null) {
        nadiMilan = nadi;
      }
    }

    return [
      {
        key: "Varna",
        guna: varnaMilan?.name || "Varna",
        boy: varnaMilan?.boy_varna || "N/A",
        girl: varnaMilan?.girl_varna || "N/A",
        max: varnaMilan?.full_score ?? "N/A",
        points: varnaMilan?.varna ?? "N/A",
        area_of_life: (varnaMilan?.description).toUpperCase() || "N/A",
      },
      {
        key: "Vasya",
        guna: vasyaMilan?.name || "Vasya",
        boy: vasyaMilan?.boy_vasya || "N/A",
        girl: vasyaMilan?.girl_vasya || "N/A",
        max: vasyaMilan?.full_score ?? "N/A",
        points: vasyaMilan?.vasya ?? "N/A",
        area_of_life: (vasyaMilan?.description).toUpperCase() || "N/A",
      },
      {
        key: "Tara",
        guna: taraMilan?.name || "Tara",
        boy: taraMilan?.boy_tara || "N/A",
        girl: taraMilan?.girl_tara || "N/A",
        max: taraMilan?.full_score ?? "N/A",
        points: taraMilan?.tara ?? "N/A",
        area_of_life: (taraMilan?.description).toUpperCase() || "N/A",
      },
      {
        key: "Yoni",
        guna: yoniMilan?.name || "Yoni",
        boy: yoniMilan?.boy_yoni || "N/A",
        girl: yoniMilan?.girl_yoni || "N/A",
        max: yoniMilan?.full_score ?? "N/A",
        points: yoniMilan?.yoni ?? "N/A",
        area_of_life: (yoniMilan?.description).toUpperCase() || "N/A",
      },
      {
        key: "Maitri",
        guna: "Maitri",
        boy: grahamaitriMilan?.boy_lord || "N/A",
        girl: grahamaitriMilan?.girl_lord || "N/A",
        max: grahamaitriMilan?.full_score ?? "N/A",
        points: grahamaitriMilan?.grahamaitri ?? "N/A",
        area_of_life: (grahamaitriMilan?.description).toUpperCase() || "N/A",
      },
      {
        key: "Gana",
        guna: ganaMilan?.name || "Gana",
        boy: ganaMilan?.boy_gana || "N/A",
        girl: ganaMilan?.girl_gana || "N/A",
        max: ganaMilan?.full_score ?? "N/A",
        points: ganaMilan?.gana ?? "N/A",
        area_of_life: (ganaMilan?.description).toUpperCase() || "N/A",
      },
      {
        key: "Bhakoot",
        guna: "Bhakoot",
        boy: bhakootMilan?.boy_rasi_name || "N/A",
        girl: bhakootMilan?.girl_rasi_name || "N/A",
        max: bhakootMilan?.full_score ?? "N/A",
        points: bhakootMilan?.bhakoot ?? "N/A",
        area_of_life: (bhakootMilan?.description).toUpperCase() || "N/A",
      },
      {
        key: "Nadi",
        guna: nadiMilan?.name || "Nadi",
        boy: nadiMilan?.boy_nadi || "N/A",
        girl: nadiMilan?.girl_nadi || "N/A",
        max: nadiMilan?.full_score ?? "N/A",
        points: nadiMilan?.nadi ?? "N/A",
        area_of_life: (nadiMilan?.description).toUpperCase() || "N/A",
      },
    ];
  };

  return (
    <motion.div
      className="nakshatra-matching-details-table"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Table
        columns={milanColumns}
        dataSource={milanData(matchingData)}
        pagination={false}
        bordered
        size="middle"
        className="nakshatra-matching-table"
        scroll={{ x: 800 }}
      />
    </motion.div>
  );
};
