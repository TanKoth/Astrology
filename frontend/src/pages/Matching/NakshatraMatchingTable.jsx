import { Table } from "antd";
import { motion } from "framer-motion";

export const NakshatraMatchingTable = ({ nakshatraMatchingData }) => {
  const { Column, ColumnGroup } = Table;
  const nakshatraMatching = (nakshatraMatchingData) => {
    if (
      !nakshatraMatchingData ||
      !nakshatraMatchingData?.report ||
      !nakshatraMatchingData?.report?.response
    ) {
      return [];
    }

    const responseDina = nakshatraMatchingData.report.response.dina;
    const responseGana = nakshatraMatchingData.report.response.gana;
    const responseMahendra = nakshatraMatchingData.report.response.mahendra;
    const responseRajju = nakshatraMatchingData.report.response.rajju;
    const responseRasi = nakshatraMatchingData.report.response.rasi;
    const responseRasiathi = nakshatraMatchingData.report.response.rasiathi;
    const responseSthree = nakshatraMatchingData.report.response.sthree;
    const responseVasya = nakshatraMatchingData.report.response.vasya;
    const responseVedha = nakshatraMatchingData.report.response.vedha;
    const responseYoni = nakshatraMatchingData.report.response.yoni;

    // Process Dina data
    let dinaData = null;
    if (responseDina) {
      if (Array.isArray(responseDina)) {
        dinaData = responseDina[0]; // Take first element if array
      } else if (typeof responseDina === "object" && responseDina !== null) {
        dinaData = responseDina;
      }
    }

    // Process Gana data
    let ganaData = null;
    if (responseGana) {
      if (Array.isArray(responseGana)) {
        ganaData = responseGana[0]; // Take first element if array
      } else if (typeof responseGana === "object" && responseGana !== null) {
        ganaData = responseGana;
      }
    }

    let mahendraData = null;
    if (responseMahendra) {
      if (Array.isArray(responseMahendra)) {
      } else if (
        typeof responseMahendra === "object" &&
        responseMahendra !== null
      ) {
        mahendraData = responseMahendra;
      }
    }

    let rajjuData = null;
    if (responseRajju) {
      if (Array.isArray(responseRajju)) {
      } else if (typeof responseRajju === "object" && responseRajju !== null) {
        rajjuData = responseRajju;
      }
    }

    let rasiData = null;
    if (responseRasi) {
      if (Array.isArray(responseRasi)) {
      } else if (typeof responseRasi === "object" && responseRasi !== null) {
        rasiData = responseRasi;
      }
    }

    let rasiathiData = null;
    if (responseRasiathi) {
      if (Array.isArray(responseRasiathi)) {
      } else if (
        typeof responseRasiathi === "object" &&
        responseRasiathi !== null
      ) {
        rasiathiData = responseRasiathi;
      }
    }
    let sthreeData = null;
    if (responseSthree) {
      if (Array.isArray(responseSthree)) {
      } else if (
        typeof responseSthree === "object" &&
        responseSthree !== null
      ) {
        sthreeData = responseSthree;
      }
    }

    let vasyaData = null;
    if (responseVasya) {
      if (Array.isArray(responseVasya)) {
      } else if (typeof responseVasya === "object" && responseVasya !== null) {
        vasyaData = responseVasya;
      }
    }

    let vedhaData = null;
    if (responseVedha) {
      if (Array.isArray(responseVedha)) {
      } else if (typeof responseVedha === "object" && responseVedha !== null) {
        vedhaData = responseVedha;
      }
    }

    let yoniData = null;
    if (responseYoni) {
      if (Array.isArray(responseYoni)) {
      } else if (typeof responseYoni === "object" && responseYoni !== null) {
        yoniData = responseYoni;
      }
    }

    // Return combined data with both Dina and Gana information
    return [
      {
        key: 0,
        // Dina data
        boyNakshatra: dinaData?.boy_star || "N/A",
        girlNakshatra: dinaData?.girl_star || "N/A",
        description: dinaData?.description || "N/A",
        score: dinaData?.dina ?? "N/A",
        fullScore: dinaData?.full_score ?? "N/A",
        // Gana data
        boyGana: ganaData?.boy_gana || "N/A",
        girlGana: ganaData?.girl_gana || "N/A",
        ganaDescription: ganaData?.description || "N/A",
        ganaScore: ganaData?.gana ?? "N/A",
        ganaFullScore: ganaData?.full_score ?? "N/A",
        // Mahendra data
        boyMahendra: mahendraData?.boy_star || "N/A",
        girlMahendra: mahendraData?.girl_star || "N/A",
        mahendraDescription: mahendraData?.description || "N/A",
        mahendraScore: mahendraData?.mahendra ?? "N/A",
        mahendraFullScore: mahendraData?.full_score ?? "N/A",
        // Rajju data
        boyRajju: rajjuData?.boy_rajju || "N/A",
        girlRajju: rajjuData?.girl_rajju || "N/A",
        rajjuDescription: rajjuData?.description || "N/A",
        rajjuScore: rajjuData?.rajju ?? "N/A",
        rajjuFullScore: rajjuData?.full_score ?? "N/A",
        // Rasi data
        boyRasi: rasiData?.boy_rasi || "N/A",
        girlRasi: rasiData?.girl_rasi || "N/A",
        rasiDescription: rasiData?.description || "N/A",
        rasiScore: rasiData?.rasi ?? "N/A",
        rasiFullScore: rasiData?.full_score ?? "N/A",
        //Rasiathi data
        boyRasiathi: rasiathiData?.boy_lord || "N/A",
        girlRasiathi: rasiathiData?.girl_lord || "N/A",
        rasiathiDescription: rasiathiData?.description || "N/A",
        rasiathiScore: rasiathiData?.rasiathi ?? "N/A",
        rasiathiFullScore: rasiathiData?.full_score ?? "N/A",
        //sthree data
        boySthree: sthreeData?.boy_star || "N/A",
        girlSthree: sthreeData?.girl_star || "N/A",
        sthreeDescription: sthreeData?.description || "N/A",
        sthreeScore: sthreeData?.sthree ?? "N/A",
        sthreeFullScore: sthreeData?.full_score ?? "N/A",
        //vasya data
        boyVasya: vasyaData?.boy_rasi || "N/A",
        girlVasya: vasyaData?.girl_rasi || "N/A",
        vasyaDescription: vasyaData?.description || "N/A",
        vasyaScore: vasyaData?.vasya ?? "N/A",
        vasyaFullScore: vasyaData?.full_score ?? "N/A",
        //vedha data
        boyVedha: vedhaData?.boy_star || "N/A",
        girlVedha: vedhaData?.girl_star || "N/A",
        vedhaDescription: vedhaData?.description || "N/A",
        vedhaScore: vedhaData?.vedha ?? "N/A",
        vedhaFullScore: vedhaData?.full_score ?? "N/A",
        //yoni data
        boyYoni: yoniData?.boy_yoni || "N/A",
        girlYoni: yoniData?.girl_yoni || "N/A",
        yoniDescription: yoniData?.description || "N/A",
        yoniScore: yoniData?.yoni ?? "N/A",
        yoniFullScore: yoniData?.full_score ?? "N/A",
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
      <h3 className="nakshatra-matching-table-title">
        Nakshatra Matching Details
      </h3>
      <Table
        dataSource={nakshatraMatching(nakshatraMatchingData)}
        pagination={false}
        bordered
        size="middle"
        className="nakshatra-matching-table"
        scroll={{ x: 800 }}
      >
        <ColumnGroup title="Dina">
          <Column
            title="Boy Nakshatra"
            dataIndex="boyNakshatra"
            key="boyNakshatra"
            width={50}
          />
          <Column
            title="Girl Nakshatra"
            dataIndex="girlNakshatra"
            key="girlNakshatra"
            width={50}
          />
          <Column
            title="Score"
            dataIndex="ganaScore"
            key="ganaScore"
            width={20}
          />
          <Column
            title="Full Score"
            dataIndex="fullScore"
            key="fullScore"
            width={20}
          />
          <Column
            title="Description"
            dataIndex="description"
            key="description"
            width={100}
          />
        </ColumnGroup>
        <ColumnGroup title="Gana">
          <Column
            title="Boy Gana"
            dataIndex="boyGana"
            key="boyGana"
            width={50}
          />
          <Column
            title="Girl Gana"
            dataIndex="girlGana"
            key="girlGana"
            width={50}
          />
          <Column
            title="Score"
            dataIndex="ganaScore"
            key="ganaScore"
            width={20}
          />
          <Column
            title="Full Score"
            dataIndex="ganaFullScore"
            key="ganaFullScore"
            width={5}
          />
          <Column
            title="Description"
            dataIndex="ganaDescription"
            key="ganaDescription"
            width={100}
          />
        </ColumnGroup>
        <ColumnGroup title="Yoni">
          <Column
            title="Boy Yoni"
            dataIndex="boyYoni"
            key="boyYoni"
            width={50}
          />
          <Column
            title="Girl Yoni"
            dataIndex="girlYoni"
            key="girlYoni"
            width={50}
          />
          <Column
            title="Score"
            dataIndex="yoniScore"
            key="yoniScore"
            width={20}
          />
          <Column
            title="Full Score"
            dataIndex="yoniFullScore"
            key="yoniFullScore"
            width={5}
          />
          <Column
            title="Description"
            dataIndex="yoniDescription"
            key="yoniDescription"
            width={100}
          />
        </ColumnGroup>
        <ColumnGroup title="Mahendra">
          <Column
            title="Boy Mahendra"
            dataIndex="boyMahendra"
            key="boyMahendra"
            width={50}
          />
          <Column
            title="Girl Mahendra"
            dataIndex="girlMahendra"
            key="girlMahendra"
            width={50}
          />
          <Column
            title="Score"
            dataIndex="mahendraScore"
            key="mahendraScore"
            width={20}
          />
          <Column
            title="Full Score"
            dataIndex="mahendraFullScore"
            key="mahendraFullScore"
            width={5}
          />
          <Column
            title="Description"
            dataIndex="mahendraDescription"
            key="mahendraDescription"
            width={100}
          />
        </ColumnGroup>
        <ColumnGroup title="Rajju">
          <Column
            title="Boy Rajju"
            dataIndex="boyRajju"
            key="boyRajju"
            width={50}
          />
          <Column
            title="Girl Rajju"
            dataIndex="girlRajju"
            key="girlRajju"
            width={50}
          />
          <Column
            title="Score"
            dataIndex="rajjuScore"
            key="rajjuScore"
            width={20}
          />
          <Column
            title="Full Score"
            dataIndex="rajjuFullScore"
            key="rajjuFullScore"
            width={5}
          />
          <Column
            title="Description"
            dataIndex="rajjuDescription"
            key="rajjuDescription"
            width={100}
          />
        </ColumnGroup>
        <ColumnGroup title="Rasi">
          <Column
            title="Boy Rasi"
            dataIndex="boyRasi"
            key="boyRasi"
            width={50}
          />
          <Column
            title="Girl Rasi"
            dataIndex="girlRasi"
            key="girlRasi"
            width={50}
          />
          <Column
            title="Score"
            dataIndex="rasiScore"
            key="rasiScore"
            width={20}
          />
          <Column
            title="Full Score"
            dataIndex="rasiFullScore"
            key="rasiFullScore"
            width={5}
          />
          <Column
            title="Description"
            dataIndex="rasiDescription"
            key="rasiDescription"
            width={100}
          />
        </ColumnGroup>
        <ColumnGroup title="Rasiathi">
          <Column
            title="Boy Lord"
            dataIndex="boyRasiathi"
            key="boyRasiathi"
            width={50}
          />
          <Column
            title="Girl Lord"
            dataIndex="girlRasiathi"
            key="girlRasiathi"
            width={50}
          />
          <Column
            title="Score"
            dataIndex="rasiathiScore"
            key="rasiathiScore"
            width={20}
          />
          <Column
            title="Full Score"
            dataIndex="rasiathiFullScore"
            key="rasiathiFullScore"
            width={5}
          />
          <Column
            title="Description"
            dataIndex="rasiathiDescription"
            key="rasiathiDescription"
            width={100}
          />
        </ColumnGroup>
        <ColumnGroup title="Sthree">
          <Column
            title="Boy Star"
            dataIndex="boySthree"
            key="boySthree"
            width={50}
          />
          <Column
            title="Girl Star"
            dataIndex="girlSthree"
            key="girlSthree"
            width={50}
          />
          <Column
            title="Score"
            dataIndex="sthreeScore"
            key="sthreeScore"
            width={20}
          />
          <Column
            title="Full Score"
            dataIndex="sthreeFullScore"
            key="sthreeFullScore"
            width={5}
          />
          <Column
            title="Description"
            dataIndex="sthreeDescription"
            key="sthreeDescription"
            width={100}
          />
        </ColumnGroup>
        <ColumnGroup title="Vasya">
          <Column
            title="Boy Rasi"
            dataIndex="boyVasya"
            key="boyVasya"
            width={50}
          />
          <Column
            title="Girl Rasi"
            dataIndex="girlVasya"
            key="girlVasya"
            width={50}
          />
          <Column
            title="Score"
            dataIndex="vasyaScore"
            key="vasyaScore"
            width={20}
          />
          <Column
            title="Full Score"
            dataIndex="vasyaFullScore"
            key="vasyaFullScore"
            width={5}
          />
          <Column
            title="Description"
            dataIndex="vasyaDescription"
            key="vasyaDescription"
            width={100}
          />
        </ColumnGroup>
        <ColumnGroup title="Vedha">
          <Column
            title="Boy Star"
            dataIndex="boyVedha"
            key="boyVedha"
            width={50}
          />
          <Column
            title="Girl Star"
            dataIndex="girlVedha"
            key="girlVedha"
            width={50}
          />
          <Column
            title="Score"
            dataIndex="vedhaScore"
            key="vedhaScore"
            width={20}
          />
          <Column
            title="Full Score"
            dataIndex="vedhaFullScore"
            key="vedhaFullScore"
            width={5}
          />
          <Column
            title="Description"
            dataIndex="vedhaDescription"
            key="vedhaDescription"
            width={100}
          />
        </ColumnGroup>
      </Table>
    </motion.div>
  );
};
