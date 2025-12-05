import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'
import { ChartData } from '@/types/analytics'

/**
 * Export data to PDF with tables and optional charts
 */
export function exportToPDF(
    title: string,
    data: any[],
    columns: { header: string; dataKey: string }[],
    fileName: string = 'report.pdf'
) {
    const doc = new jsPDF()

    // Add title
    doc.setFontSize(18)
    doc.text(title, 14, 22)

    // Add date
    doc.setFontSize(10)
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30)

    // Add table
    autoTable(doc, {
        startY: 35,
        head: [columns.map(col => col.header)],
        body: data.map(row => columns.map(col => row[col.dataKey] || '')),
        theme: 'striped',
        headStyles: { fillColor: [29, 78, 216] }, // Primary blue
        margin: { top: 35 }
    })

    // Save PDF
    doc.save(fileName)
}

/**
 * Export student performance report to PDF
 */
export function exportStudentReportToPDF(
    studentName: string,
    metrics: {
        averageScore: number
        attendance: number
        assignmentsCompleted: number
        totalAssignments: number
    },
    submissions: any[],
    fileName: string = 'student_report.pdf'
) {
    const doc = new jsPDF()

    // Title
    doc.setFontSize(20)
    doc.text(`Student Performance Report`, 14, 20)

    // Student name
    doc.setFontSize(14)
    doc.text(studentName, 14, 30)

    // Date
    doc.setFontSize(10)
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 37)

    // Summary metrics
    doc.setFontSize(12)
    doc.text('Summary', 14, 50)
    doc.setFontSize(10)
    doc.text(`Average Score: ${metrics.averageScore.toFixed(1)}%`, 14, 58)
    doc.text(`Attendance: ${metrics.attendance.toFixed(1)}%`, 14, 65)
    doc.text(`Assignments Completed: ${metrics.assignmentsCompleted}/${metrics.totalAssignments}`, 14, 72)

    // Submissions table
    if (submissions.length > 0) {
        autoTable(doc, {
            startY: 80,
            head: [['Assignment', 'Score', 'Max Points', 'Percentage', 'Status']],
            body: submissions.map(s => [
                s.assignmentTitle || s.assignmentId,
                s.grade || 'N/A',
                s.maxPoints,
                s.grade ? `${((s.grade / s.maxPoints) * 100).toFixed(1)}%` : 'N/A',
                s.status
            ]),
            theme: 'grid',
            headStyles: { fillColor: [29, 78, 216] }
        })
    }

    doc.save(fileName)
}

/**
 * Export batch analytics to PDF
 */
export function exportBatchReportToPDF(
    batchName: string,
    analytics: {
        totalStudents: number
        averageScore: number
        averageAttendance: number
        activeStudents: number
    },
    studentData: any[],
    fileName: string = 'batch_report.pdf'
) {
    const doc = new jsPDF()

    // Title
    doc.setFontSize(20)
    doc.text(`Batch Analytics Report`, 14, 20)

    // Batch name
    doc.setFontSize(14)
    doc.text(batchName, 14, 30)

    // Date
    doc.setFontSize(10)
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 37)

    // Summary metrics
    doc.setFontSize(12)
    doc.text('Batch Summary', 14, 50)
    doc.setFontSize(10)
    doc.text(`Total Students: ${analytics.totalStudents}`, 14, 58)
    doc.text(`Active Students: ${analytics.activeStudents}`, 14, 65)
    doc.text(`Average Score: ${analytics.averageScore.toFixed(1)}%`, 14, 72)
    doc.text(`Average Attendance: ${analytics.averageAttendance.toFixed(1)}%`, 14, 79)

    // Student performance table
    if (studentData.length > 0) {
        autoTable(doc, {
            startY: 90,
            head: [['Student Name', 'Avg Score', 'Attendance', 'Assignments']],
            body: studentData.map(s => [
                s.name,
                `${s.averageScore.toFixed(1)}%`,
                `${s.attendance.toFixed(1)}%`,
                `${s.assignmentsCompleted}/${s.totalAssignments}`
            ]),
            theme: 'grid',
            headStyles: { fillColor: [29, 78, 216] }
        })
    }

    doc.save(fileName)
}

/**
 * Export data to Excel spreadsheet
 */
export function exportToExcel(
    data: any[],
    sheetName: string = 'Sheet1',
    fileName: string = 'export.xlsx'
) {
    // Create workbook and worksheet
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(data)

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, sheetName)

    // Save file
    XLSX.writeFile(wb, fileName)
}

/**
 * Export batch analytics to Excel with multiple sheets
 */
export function exportBatchToExcel(
    batchName: string,
    overview: any,
    students: any[],
    attendance: any[],
    fileName: string = 'batch_analytics.xlsx'
) {
    const wb = XLSX.utils.book_new()

    // Overview sheet
    const overviewData = [
        { Metric: 'Batch Name', Value: batchName },
        { Metric: 'Total Students', Value: overview.totalStudents },
        { Metric: 'Active Students', Value: overview.activeStudents },
        { Metric: 'Average Score', Value: `${overview.averageScore.toFixed(1)}%` },
        { Metric: 'Average Attendance', Value: `${overview.averageAttendance.toFixed(1)}%` },
        { Metric: 'Generated', Value: new Date().toLocaleString() }
    ]
    const wsOverview = XLSX.utils.json_to_sheet(overviewData)
    XLSX.utils.book_append_sheet(wb, wsOverview, 'Overview')

    // Students sheet
    if (students.length > 0) {
        const wsStudents = XLSX.utils.json_to_sheet(students)
        XLSX.utils.book_append_sheet(wb, wsStudents, 'Students')
    }

    // Attendance sheet
    if (attendance.length > 0) {
        const wsAttendance = XLSX.utils.json_to_sheet(attendance)
        XLSX.utils.book_append_sheet(wb, wsAttendance, 'Attendance')
    }

    // Save file
    XLSX.writeFile(wb, fileName)
}

/**
 * Export student list to Excel
 */
export function exportStudentListToExcel(
    students: any[],
    fileName: string = 'students.xlsx'
) {
    const formattedData = students.map(s => ({
        'Student Name': s.name,
        'Average Score': s.averageScore ? `${s.averageScore.toFixed(1)}%` : 'N/A',
        'Attendance': s.attendance ? `${s.attendance.toFixed(1)}%` : 'N/A',
        'Assignments Completed': `${s.assignmentsCompleted || 0}/${s.totalAssignments || 0}`,
        'Last Active': s.lastActive ? new Date(s.lastActive).toLocaleDateString() : 'N/A'
    }))

    exportToExcel(formattedData, 'Students', fileName)
}

/**
 * Export attendance records to Excel
 */
export function exportAttendanceToExcel(
    records: any[],
    fileName: string = 'attendance.xlsx'
) {
    const formattedData = records.map(r => ({
        'Date': new Date(r.date).toLocaleDateString(),
        'Class': r.className,
        'Student': r.studentName,
        'Status': r.status,
        'Marked By': r.markedBy || 'System'
    }))

    exportToExcel(formattedData, 'Attendance Records', fileName)
}

/**
 * Prepare chart data for export
 */
export function prepareChartDataForExport(chartData: ChartData[]): any[] {
    return chartData.map(item => ({
        Category: item.name,
        Value: item.value,
        ...Object.fromEntries(
            Object.entries(item).filter(([key]) => key !== 'name' && key !== 'value')
        )
    }))
}
