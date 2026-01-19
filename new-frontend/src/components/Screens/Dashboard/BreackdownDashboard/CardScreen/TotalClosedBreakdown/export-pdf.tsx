import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    fontFamily: "Helvetica",
    fontSize: 10,
    padding: 15,
    position: "relative",
  },

  headerBar: {
    backgroundColor: "#D9EAD3",
    border: "1 solid #6AA84F",
    color: "#38761D",
    borderRadius: 6,
    paddingVertical: 10,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 8,
  },

  companyContainer: {
    border: "1 solid #6AA84F",
    padding: 6,
    marginBottom: 8,
    borderRadius: 6,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  companyInfo: {
    width: "70%",
    lineHeight: 1.3,
  },
  companyTitle: {
    color: "#1155CC",
    fontWeight: "bold",
    marginBottom: 2,
  },
  companyWebsite: {
    color: "#1155CC",
    fontSize: 9,
  },
  companyLogo: {
    width: 90,
    height: 30,
    objectFit: "contain",
  },

  section: {
    border: "1 solid #6AA84F",
    padding: 6,
    marginBottom: 10,
    borderRadius: 6,
  },
  row: {
    flexDirection: "row",
    marginVertical: 3,
  },
  label: {
    width: "40%",
    fontWeight: "bold",
    color: "#38761D",
  },
  value: {
    width: "60%",
  },

  signatureContainer: {
    border: "1 solid #6AA84F",
    backgroundColor: "#D9EAD3",
    padding: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 15,
    borderRadius: 6,
  },
  signatureBox: {
    width: "48%",
    marginBottom: 10,
    textAlign: "left",
  },
  signatureLabel: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  signatureLine: {
    marginTop: 15,
    borderBottom: "1 solid #000",
    width: "100%",
  },

  footer: {
    position: "absolute",
    bottom: 15,
    left: 0,
    right: 0,
    borderTop: "2 solid #6AA84F",
    paddingTop: 4,
    fontSize: 9,
    textAlign: "center",
  },

  watermarkConfidential: {
    position: "absolute",
    top: "40%",
    left: "25%",
    fontSize: 40,
    color: "#d9d9d9",
    opacity: 0.3,
    transform: "rotate(-30deg)",
  },
  watermarkBottom: {
    position: "absolute",
    bottom: "20%",
    left: "15%",
    fontSize: 28,
    color: "#e6e6e6",
    opacity: 0.5,
  },
});

const BreakdownPDF = ({ data }: any) => {
  const formatDateTime = (isoDate?: string) => {
    if (!isoDate) return "N/A";
    const date = new Date(isoDate);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const demo = {
    machineName: data?.machine?.machine_name || "N/A",
    equipmentId: data?.machine?.eqid || "N/A",
    department: data?.department?.departmentName || "N/A",
    lab: data?.lab?.labName || "N/A",
    location: data?.machine?.location || "N/A",
    breakdownDescription: data?.observation || "N/A",
    correctiveAction: data?.action_taken || "N/A",
    rootCause: data?.root_cause || "N/A",
    spareUsed: data?.spare_used || "Not Used",
    repairingTime: data?.repairingTime || "N/A",
    repairingDate: data?.actualWorkingStartTime
      ? formatDateTime(data.actualWorkingStartTime)
      : "01/01/1970, 05:30 am",
    totalBDTime: data?.totalBreakdownTime || "N/A",
    raiseTime: formatDateTime(data?.ticket_raised_time),
    endTime: formatDateTime(data?.ticket_closed_time),
    attendBy: data?.addedBy
      ? `${data.addedBy.firstName} ${data.addedBy.lastName}`
      : "N/A",
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Watermarks */}
        <Text style={styles.watermarkConfidential}>CONFIDENTIAL</Text>
        <Text style={styles.watermarkBottom}>Breakdown Sheet</Text>

        {/* Header */}
        <Text style={styles.headerBar}>General Breakdown Sheet</Text>

        {/* Company Info */}
        <View style={styles.companyContainer}>
          <View style={styles.companyInfo}>
            <Text style={styles.companyTitle}>KF Bioplants Private Limited</Text>
            <Text>Taluka Haveli, Sr. No. 129/1-3C, Manjri Bk,</Text>
            <Text>Pune, Maharashtra 411036</Text>
            <Text>Phone: 020 2694 8400 / 8401 / 8402</Text>
            <Text style={styles.companyWebsite}>
              Website: https://www.kfbioplants.com
            </Text>
          </View>
          <Image
            style={styles.companyLogo}
            src="https://www.kfbioplants.com/wp-content/uploads/2022/03/logo.png"
          />
        </View>

        {/* Breakdown Details */}
        <View style={styles.section}>
          {[
            ["Machine Name:", demo.machineName],
            ["Equipment ID:", demo.equipmentId],
            ["Department:", demo.department],
            ["Lab:", demo.lab],
            ["Location:", demo.location],
            ["Breakdown Description:", demo.breakdownDescription],
            ["Corrective Action:", demo.correctiveAction],
            ["Breakdown Root Cause:", demo.rootCause],
            ["Spare Used:", demo.spareUsed],
            ["Repairing Time:", demo.repairingTime],
            ["Repairing Date:", demo.repairingDate],
            ["Total BD Time:", demo.totalBDTime],
            ["Raise Time:", demo.raiseTime],
            ["End Time:", demo.endTime],
            ["Attend By:", demo.attendBy],
          ].map(([label, value], i) => (
            <View style={styles.row} key={i}>
              <Text style={styles.label}>{label}</Text>
              <Text style={styles.value}>{value}</Text>
            </View>
          ))}
        </View>

        {/* Signature Section */}
        <View style={styles.signatureContainer}>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureLabel}>Dept. Incharge Name:</Text>
            <View style={styles.signatureLine} />
          </View>

          <View style={styles.signatureBox}>
            <Text style={styles.signatureLabel}>Dept. Incharge Signature:</Text>
            <View style={styles.signatureLine} />
          </View>

          <View style={styles.signatureBox}>
            <Text style={styles.signatureLabel}>Prepared By (Sr. Supervisor):</Text>
            <View style={styles.signatureLine} />
          </View>

          <View style={styles.signatureBox}>
            <Text style={styles.signatureLabel}>
              Approved By (Maintenance Manager):
            </Text>
            <View style={styles.signatureLine} />
          </View>
        </View>

        {/* Footer */}
        <Text style={{ fontStyle: "italic" }}>
          Breakdown Slip No: {data?.bd_slip || "N/A"} | Generated:{" "}
          {formatDateTime(new Date().toISOString())}
        </Text>

        <View style={styles.footer}>
          <Text style={{ fontStyle: "italic" }}>
            Generated by Maintenance Management System
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default BreakdownPDF;
