import {
  Document,
  Font,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import React from "react";

// Register Bengali fonts using TTF
// Option 1: Using Google Fonts TTF (if available)
Font.register({
  family: "NotoSansBengali",
  fonts: [
    { src: "/fonts/static/NotoSansBengali-Regular.ttf" },
    { src: "/fonts/static/NotoSansBengali-Bold.ttf", fontWeight: "bold" },
  ],
});

// Use system fonts that support Bengali as fallback
const bengaliFontFamily = "NotoSansBengali";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "white",
    padding: 15,
    fontFamily: bengaliFontFamily,
    fontSize: 8,
  },
  container: {
    backgroundColor: "white",
    padding: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 15,
    paddingBottom: 10,
    borderBottom: "1px solid #000",
  },
  logoContainer: {
    width: 70,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  logo: {
    width: 50,
    height: 50,
  },
  headerContent: {
    textAlign: "center",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 80,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 3,
    color: "#000",
    fontFamily: bengaliFontFamily,
  },
  headerText: {
    fontSize: 8,
    marginBottom: 1,
    color: "#000",
    fontFamily: bengaliFontFamily,
  },
  doctorInfo: {
    textAlign: "right",
    fontSize: 9,
    color: "#000",
    width: 150,
    alignItems: "flex-end",
    justifyContent: "center",
    fontFamily: bengaliFontFamily,
  },
  row: {
    flexDirection: "row",
    marginBottom: 8,
  },
  colLeft: {
    flex: 1,
    paddingRight: 15,
  },
  colRight: {
    flex: 1,
  },
  field: {
    marginBottom: 6,
  },
  label: {
    fontWeight: "bold",
    fontSize: 8,
    marginBottom: 1,
    color: "#000",
    fontFamily: bengaliFontFamily,
    whiteSpace: "nowrap",
  },
  input: {
    border: "1px solid #000",
    padding: 2,
    fontSize: 8,
    minHeight: 12,
    fontFamily: bengaliFontFamily,
  },
  patientInfo: {
    backgroundColor: "#f0f0f0",
    padding: 8,
    marginBottom: 8,
    border: "1px solid #000",
  },
  vitalSigns: {
    backgroundColor: "#f8f8f8",
    padding: 8,
    marginBottom: 8,
    border: "1px solid #000",
  },
  prescriptionSection: {
    backgroundColor: "#fff",
    padding: 8,
    border: "1px solid #000",
    marginBottom: 8,
    minHeight: 207, // Adjusted for better spacing
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#000",
    fontFamily: bengaliFontFamily,
  },
  medicationItem: {
    marginBottom: 4,
    padding: 3,
    backgroundColor: "#f9f9f9",
    border: "1px solid #ddd",
  },
  medicationName: {
    fontWeight: "bold",
    fontSize: 8,
    fontFamily: bengaliFontFamily,
  },
  medicationDetails: {
    fontSize: 7,
    marginTop: 1,
    fontFamily: bengaliFontFamily,
  },
  adviceSection: {
    backgroundColor: "#f0f8f0",
    padding: 8,
    marginBottom: 8,
    border: "1px solid #000",
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    fontSize: 7,
    color: "#000",
    marginTop: 10,
    borderTop: "1px solid #000",
    paddingTop: 5,
    fontFamily: bengaliFontFamily,
  },
  textArea: {
    border: "1px solid #000",
    padding: 3,
    fontSize: 8,
    minHeight: 20,
    fontFamily: bengaliFontFamily,
  },
  animalImage: {
    width: 60,
    height: 45,
    border: "1px solid #000",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 7,
    color: "#666",
    fontFamily: bengaliFontFamily,
  },
  gridRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  gridCol: {
    flex: 1,
    marginRight: 10,
  },
  lastGridCol: {
    flex: 1,
  },
  qrCode: {
    width: 50,
    height: 50,
  },
});

interface PrescriptionData {
  id: string;
  reference: string;
  doctor: {
    name: string;
    address: string;
    lastDegree: string;
    areaOfExpertise: string;
  };
  patient: {
    name: string;
    address: string;
    mobileNumber?: string;
    email?: string;
  };
  animalType: string;
  patientNumber: string;
  age?: string;
  sex?: string;
  weight?: number;
  ownersComplaints?: string;
  temperature?: string;
  spo2?: string;
  respirationRate?: string;
  fecesStatus?: string;
  nasalSecretion?: string;
  feedingHistory?: string;
  medicationHistory?: string;
  investigation?: string;
  medications: Array<{
    name: string;
    dosage: string;
    instructions: string;
    duration: string;
  }>;
  advice?: string;
  td?: string;
  consultancyFee?: number;
  createdAt: string;
  followUpDate?: string;
  animalPicture?: string;
}

interface PrescriptionDocumentProps {
  data: PrescriptionData;
  qrUrl: Promise<string>;
}

const PrescriptionDocument: React.FC<PrescriptionDocumentProps> = ({
  data,
  qrUrl,
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.container}>
        {/* Header with Logo */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image src="/logo-med.png" style={styles.logo} />
          </View>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>ADI PET and LIVESTOCK CARE</Text>
            <Text style={styles.headerText}>
              Chamber: 87 Paltan Tower, Purana Paltan Lane
            </Text>
            <Text style={styles.headerText}>Dhaka-1000, Bangladesh</Text>
            <Text style={styles.headerText}>
              Mobile: +8801712652107; Hotline:09611083002
            </Text>
            <Text style={styles.headerText}>
              E-mail: adirakib21@gmail.com; www.adibd.net
            </Text>
          </View>
          {/* Doctor Info */}
          <View style={styles.doctorInfo}>
            <Text>{data.doctor?.name || ""}</Text>
            <Text>{data.doctor?.lastDegree || ""}</Text>
            <Text>{data.doctor?.areaOfExpertise || ""}</Text>
          </View>
        </View>

        {/* Registration Info */}
        <View style={styles.row}>
          <View style={styles.colLeft}>
            <View style={styles.field}>
              <Text style={styles.label}>Reference/(PID):</Text>
              <Text style={styles.input}>{data.reference}</Text>
            </View>
          </View>
          <View style={styles.colRight}>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <View style={[styles.field, { flex: 1 }]}>
                <Text style={{ ...styles.label }}>Consultancy Fee:</Text>
                <Text style={styles.input}>{data.consultancyFee || ""}</Text>
              </View>
              <View style={[styles.field, { flex: 1 }]}>
                <Text style={styles.label}>Date:</Text>
                <Text style={styles.input}>
                  {new Date(data.createdAt).toLocaleDateString()}
                </Text>
              </View>
              <View style={[styles.field, { flex: 1 }]}>
                <Text style={styles.label}>Follow up:</Text>
                <Text style={styles.input}>
                  {data.followUpDate
                    ? new Date(data.followUpDate).toLocaleDateString()
                    : ""}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Patient Info */}
        <View style={styles.patientInfo}>
          <View style={{ ...styles.row, marginBottom: 0, paddingBottom: 0 }}>
            <View style={styles.colLeft}>
              <View style={styles.field}>
                <Text style={styles.label}>Owner's Name:</Text>
                <Text style={styles.input}>{data.patient?.name || ""}</Text>
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Address:</Text>
                <Text style={styles.textArea}>
                  {data.patient?.address || ""}
                </Text>
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Mobile Number:</Text>
                <Text style={styles.input}>
                  {data.patient?.mobileNumber || ""}
                </Text>
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Email:</Text>
                <Text style={styles.input}>
                  {data.patient?.email !== data.patient?.mobileNumber
                    ? data.patient?.email
                    : ""}
                </Text>
              </View>
            </View>

            <View style={styles.colRight}>
              <View style={{ flexDirection: "row", gap: 8 }}>
                <View style={[styles.field, { flex: 1 }]}>
                  <Text style={styles.label}>Patient Type:</Text>
                  <Text style={styles.input}>{data.animalType}</Text>
                </View>
                <View style={[styles.field, { flex: 1 }]}>
                  <Text style={styles.label}>Patient Name/Tag no:</Text>
                  <Text style={styles.input}>{data.patientNumber}</Text>
                </View>
              </View>

              <View style={styles.gridRow}>
                <View style={styles.gridCol}>
                  <Text style={styles.label}>Age(Year):</Text>
                  <Text style={styles.input}>{data.age || ""}</Text>
                </View>
                <View style={styles.gridCol}>
                  <Text style={styles.label}>Sex (M/F):</Text>
                  <Text style={styles.input}>{data.sex || ""}</Text>
                </View>
                <View style={styles.lastGridCol}>
                  <Text style={styles.label}>Weight (Kg):</Text>
                  <Text style={styles.input}>{data.weight || ""}</Text>
                </View>
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Owner's Complaints:</Text>
                <Text style={styles.textArea}>
                  {data.ownersComplaints || ""}
                </Text>
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Patient's Picture:</Text>
                <View style={styles.animalImage}>
                  {data.animalPicture ? (
                    <Image
                      src={data.animalPicture}
                      style={{ width: 60, height: 45 }}
                    />
                  ) : (
                    <Text style={{ fontFamily: bengaliFontFamily }}>
                      No Image
                    </Text>
                  )}
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Vital Signs and Prescription Row */}
        <View style={styles.row}>
          {/* Left Column - Vital Signs */}
          <View style={styles.colLeft}>
            <View style={styles.vitalSigns}>
              <View style={styles.gridRow}>
                <View style={styles.gridCol}>
                  <Text style={styles.label}>Temperature (°F):</Text>
                  <Text style={styles.input}>{data.temperature || ""}</Text>
                </View>
                <View style={styles.lastGridCol}>
                  <Text style={styles.label}>SpO2 (%):</Text>
                  <Text style={styles.input}>{data.spo2 || ""}</Text>
                </View>
              </View>
              <View style={styles.gridRow}>
                <View style={styles.gridCol}>
                  <Text style={styles.label}>Respiration Rate:</Text>
                  <Text style={styles.input}>{data.respirationRate || ""}</Text>
                </View>
                <View style={styles.lastGridCol}>
                  <Text style={styles.label}>Feces Status:</Text>
                  <Text style={styles.input}>{data.fecesStatus || ""}</Text>
                </View>
              </View>
              <View style={styles.gridRow}>
                <View style={styles.gridCol}>
                  <Text style={styles.label}>Nasal Secretion:</Text>
                  <Text style={styles.input}>{data.nasalSecretion || ""}</Text>
                </View>
                <View style={styles.lastGridCol}>
                  <Text style={styles.label}>Feeding History:</Text>
                  <Text style={styles.input}>{data.feedingHistory || ""}</Text>
                </View>
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Medication History:</Text>
                <Text style={styles.textArea}>
                  {data.medicationHistory || ""}
                </Text>
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Investigation:</Text>
                <Text style={styles.textArea}>{data.investigation || ""}</Text>
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Tentative Diagnosis:</Text>
                <Text style={styles.textArea}>{data.td || ""}</Text>
              </View>
            </View>
          </View>

          {/* Right Column - Prescription */}
          <View style={styles.colRight}>
            <View style={styles.prescriptionSection}>
              <Text style={styles.sectionTitle}>Rx.</Text>
              {data.medications?.map((medication, index) => (
                <View key={index} style={styles.medicationItem}>
                  <Text style={styles.medicationName}>
                    {index + 1}. {medication.name} - {medication.dosage}
                  </Text>
                  <Text style={styles.medicationDetails}>
                    Sig: {medication.instructions}
                  </Text>
                  <Text style={styles.medicationDetails}>
                    Duration: {medication.duration}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Advice Section */}
        <View style={styles.adviceSection}>
          <Text style={styles.sectionTitle}>Advice:</Text>
          <Text
            style={{
              fontSize: 8,
              fontFamily: bengaliFontFamily,
            }}
          >
            {data.advice || ""}
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Image style={styles.qrCode} src={qrUrl} />
          <Text
            style={{
              fontFamily: bengaliFontFamily,
            }}
          >
            © All Rights Reserved. Note: Preserve The Prescription for Next
            Reference.
          </Text>
          <View></View>
        </View>
      </View>
    </Page>
  </Document>
);

export { PrescriptionDocument };
