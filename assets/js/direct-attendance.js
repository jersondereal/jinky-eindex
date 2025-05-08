import { addAttendanceRecord, showToast } from './api.js';

// Initialize direct attendance functionality
export function initializeDirectAttendance() {
    const attendanceRfidInput = document.getElementById('attendanceRfidInput');
    const directAttendanceModal = document.getElementById('directAttendanceModal');
    const closeAttendanceModalBtn = document.getElementById('closeAttendanceModalBtn');
    const cancelAttendanceBtn = document.getElementById('cancelAttendanceBtn');
    const saveAttendanceBtn = document.getElementById('saveAttendanceBtn');
    const directAttendanceForm = document.getElementById('directAttendanceForm');

    let currentStudentId = null;

    // Handle RFID input
    attendanceRfidInput?.addEventListener('input', async (e) => {
        const rfidTag = e.target.value.trim();
        if (rfidTag.length === 10) { // Assuming RFID tags are 10 characters
            try {
                const response = await fetch(`https://jinky-eindex.onrender.com/api/students/rfid/${rfidTag}`);
                const data = await response.json();
                
                if (data.success) {
                    currentStudentId = data.student.id;
                    showAttendanceModal(data.student);
                } else {
                    showToast('Student not found', 'error');
                }
            } catch (error) {
                console.error('Error fetching student:', error);
                showToast('Error fetching student details', 'error');
            }
            
            // Clear input after processing
            e.target.value = '';
        }
    });

    // Show attendance modal with student info
    function showAttendanceModal(student) {
        // Add student info under the header
        const modalHeader = directAttendanceModal.querySelector('.modal-header');
        const studentInfoDiv = document.createElement('div');
        studentInfoDiv.className = 'student-info-header';
        studentInfoDiv.innerHTML = `
            <p><strong>Name:</strong> ${student.name}</p>
            <p><strong>Course:</strong> ${student.course}</p>
            <p><strong>Year:</strong> ${student.year}</p>
            <p><strong>Section:</strong> ${student.section}</p>
        `;
        
        // Insert after the header
        modalHeader.insertAdjacentElement('afterend', studentInfoDiv);

        // Set current date and time
        const now = new Date();
        const dateInput = directAttendanceForm.querySelector('[name="date"]');
        const timeInput = directAttendanceForm.querySelector('[name="time"]');
        
        if (dateInput) {
            const today = now.toISOString().split('T')[0];
            dateInput.value = today;
        }
        
        if (timeInput) {
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            timeInput.value = `${hours}:${minutes}`;
        }

        // Show modal
        directAttendanceModal.classList.add('active');
    }

    // Close modal
    function closeAttendanceModal() {
        directAttendanceModal.classList.remove('active');
        directAttendanceForm.reset();
        // Remove student info when closing
        const studentInfoDiv = directAttendanceModal.querySelector('.student-info-header');
        if (studentInfoDiv) {
            studentInfoDiv.remove();
        }
        currentStudentId = null;
    }

    // Close modal buttons
    closeAttendanceModalBtn?.addEventListener('click', closeAttendanceModal);
    cancelAttendanceBtn?.addEventListener('click', closeAttendanceModal);

    // Modal backdrop click
    directAttendanceModal?.addEventListener('click', (e) => {
        if (e.target === directAttendanceModal) {
            closeAttendanceModal();
        }
    });

    // Save attendance
    saveAttendanceBtn?.addEventListener('click', async () => {
        if (!validateForm(directAttendanceForm)) {
            return;
        }

        try {
            const formData = new FormData(directAttendanceForm);
            const attendanceData = {
                subject: formData.get('attendance_subject'),
                date: formData.get('date'),
                time: formData.get('time')
            };

            const response = await addAttendanceRecord(currentStudentId, attendanceData);
            
            if (response.success) {
                showToast('Attendance recorded successfully', 'success');
                closeAttendanceModal();
            } else {
                showToast(response.message || 'Failed to record attendance', 'error');
            }
        } catch (error) {
            console.error('Error saving attendance:', error);
            showToast('Error saving attendance', 'error');
        }
    });
}

// Form validation
function validateForm(form) {
    let isValid = true;
    clearValidation(form);
    
    if (!form.attendance_subject.value) {
        setInvalid('attendance_subject', 'Please select a subject');
        isValid = false;
    }
    
    if (!form.date.value) {
        setInvalid('date', 'Please select a date');
        isValid = false;
    }
    
    if (!form.time.value) {
        setInvalid('time', 'Please select a time');
        isValid = false;
    }

    return isValid;
}

function clearValidation(form) {
    form.querySelectorAll('.is-invalid').forEach(input => {
        input.classList.remove('is-invalid');
    });
}

function setInvalid(fieldName, message) {
    const field = document.querySelector(`[name="${fieldName}"]`);
    field.classList.add('is-invalid');
    field.nextElementSibling.textContent = message;
} 