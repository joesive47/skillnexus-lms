import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    padding: 60,
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 40,
    textAlign: 'center',
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginBottom: 10,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 40,
    textAlign: 'center',
  },
  content: {
    marginTop: 30,
    marginBottom: 30,
  },
  text: {
    fontSize: 12,
    color: '#374151',
    marginBottom: 10,
    textAlign: 'center',
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  course: {
    fontSize: 20,
    color: '#3b82f6',
    marginTop: 10,
    marginBottom: 30,
    textAlign: 'center',
  },
  bardSection: {
    marginTop: 30,
    padding: 20,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
  },
  bardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 15,
    textAlign: 'center',
  },
  bardGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  bardItem: {
    width: '22%',
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 4,
  },
  bardLabel: {
    fontSize: 10,
    color: '#6b7280',
    marginBottom: 5,
  },
  bardValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  footer: {
    marginTop: 40,
    paddingTop: 20,
    borderTop: '2 solid #e5e7eb',
  },
  footerText: {
    fontSize: 10,
    color: '#9ca3af',
    textAlign: 'center',
    marginBottom: 5,
  },
  certNumber: {
    fontSize: 10,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 10,
  },
})

interface CertificatePDFProps {
  userName: string
  courseName: string
  certificateNumber: string
  issuedDate: string
  bardData?: {
    careerReadiness: {
      fitScore: number
      readinessLevel: number
    }
  }
}

export const CertificatePDF = ({ 
  userName, 
  courseName, 
  certificateNumber, 
  issuedDate,
  bardData 
}: CertificatePDFProps) => (
  <Document>
    <Page size="A4" orientation="landscape" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.logo}>SkillNexus LMS</Text>
        <Text style={styles.subtitle}>Global Learning Management System</Text>
      </View>

      <Text style={styles.title}>Certificate of Completion</Text>

      <View style={styles.content}>
        <Text style={styles.text}>This is to certify that</Text>
        <Text style={styles.name}>{userName}</Text>
        <Text style={styles.text}>has successfully completed the course</Text>
        <Text style={styles.course}>{courseName}</Text>
        <Text style={styles.text}>Issued on {issuedDate}</Text>
      </View>

      {bardData && (
        <View style={styles.bardSection}>
          <Text style={styles.bardTitle}>BARD Competency Assessment</Text>
          <View style={styles.bardGrid}>
            <View style={styles.bardItem}>
              <Text style={styles.bardLabel}>Career Fit Score</Text>
              <Text style={styles.bardValue}>{bardData.careerReadiness.fitScore}/100</Text>
            </View>
            <View style={styles.bardItem}>
              <Text style={styles.bardLabel}>Readiness Level</Text>
              <Text style={styles.bardValue}>{bardData.careerReadiness.readinessLevel}/5</Text>
            </View>
            <View style={styles.bardItem}>
              <Text style={styles.bardLabel}>Status</Text>
              <Text style={styles.bardValue}>VERIFIED</Text>
            </View>
            <View style={styles.bardItem}>
              <Text style={styles.bardLabel}>Blockchain</Text>
              <Text style={styles.bardValue}>SECURED</Text>
            </View>
          </View>
        </View>
      )}

      <View style={styles.footer}>
        <Text style={styles.footerText}>This certificate is digitally signed and blockchain verified</Text>
        <Text style={styles.footerText}>SkillNexus Learning Management System</Text>
        <Text style={styles.certNumber}>Certificate No: {certificateNumber}</Text>
      </View>
    </Page>
  </Document>
)
