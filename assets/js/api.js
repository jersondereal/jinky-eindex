const API_URL = 'http://localhost:3000/api';

// API calls
export async function getAllStudents() {
    try {
        const response = await fetch(`${API_URL}/students`);
        console.log('Raw Response:', response);
        
        const data = await response.json();
        console.log('Parsed Data:', data);
        
        if (!response.ok) throw new Error('Failed to fetch students');
        return data;
    } catch (error) {
        console.error('Error fetching students:', error);
        throw error;
    }
}

export async function getStudentById(id) {
    try {
        const response = await fetch(`${API_URL}/students/${id}`);
        if (!response.ok) throw new Error('Failed to fetch student');
        return await response.json();
    } catch (error) {
        console.error('Error fetching student:', error);
        throw error;
    }
}

export async function createStudent(data) {
    try {
        const response = await fetch(`${API_URL}/students`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return await response.json();
    } catch (error) {
        console.error('Error creating student:', error);
        throw error;
    }
}

export async function updateStudent(id, data) {
    try {
        const response = await fetch(`${API_URL}/students/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return await response.json();
    } catch (error) {
        console.error('Error updating student:', error);
        throw error;
    }
}

export async function deleteStudent(id) {
    try {
        const response = await fetch(`${API_URL}/students/${id}`, {
            method: 'DELETE'
        });
        return await response.json();
    } catch (error) {
        console.error('Error deleting student:', error);
        throw error;
    }
}

// Academic Records API
export async function addAcademicRecord(studentId, data) {
    try {
        data.record_type = 'academic';
        
        const response = await fetch(`${API_URL}/records/${studentId}/records`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error adding academic record:', error);
        throw error;
    }
}

export async function getAcademicRecord(recordId, studentId) {
    try {
        const response = await fetch(`${API_URL}/records/${studentId}/records/${recordId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        const result = await response.json();
        return result.success ? result.record : null;
    } catch (error) {
        console.error('Error getting academic record:', error);
        throw error;
    }
}

export async function updateAcademicRecord(recordId, data, studentId) {
    try {
        data.record_type = 'academic';
        
        const response = await fetch(`${API_URL}/records/${studentId}/records/${recordId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error updating academic record:', error);
        throw error;
    }
}

export async function deleteAcademicRecord(recordId, studentId) {
    try {
        const response = await fetch(`${API_URL}/records/${studentId}/records/${recordId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error deleting academic record:', error);
        throw error;
    }
}

// Attendance Records API
export async function addAttendanceRecord(studentId, data) {
    try {
        // Use the attendance API
        const response = await fetch(`${API_URL}/attendance`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                student_id: studentId,
                subject_id: getSubjectIdFromCode(data.subject),
                // No need to include record_type
            })
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error adding attendance record:', error);
        throw error;
    }
}

// Helper function to get subject ID from subject code
function getSubjectIdFromCode(subjectCode) {
    // Based on the sample data, IT223 is ID 1 and IT221 is ID 2
    if (subjectCode === 'IT223') return 1;
    if (subjectCode === 'IT221') return 2;
    return null;
}

export async function getAttendanceRecord(recordId, studentId) {
    try {
        // Note: There's no direct endpoint to get a single attendance record
        // So we'll get all attendance for the student and find the specific one
        const response = await fetch(`${API_URL}/attendance/students/${studentId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        const result = await response.json();
        if (!result.success) {
            throw new Error(result.message || 'Failed to get attendance records');
        }
        
        // Find the specific record by ID
        const record = result.attendance.find(record => record.id === parseInt(recordId));
        return record || null;
    } catch (error) {
        console.error('Error getting attendance record:', error);
        throw error;
    }
}

export async function deleteAttendanceRecord(recordId, studentId) {
    try {
        // Use the attendance API
        const response = await fetch(`${API_URL}/attendance/${recordId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error deleting attendance record:', error);
        throw error;
    }
}

// Toast notifications
export function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    toast.innerHTML = `
        <div class="toast-content">
            <div class="toast-message">${message}</div>
            <button type="button" class="btn-toast" onclick="this.closest('.toast').remove()">×</button>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Form utilities
export function getFormData(formId) {
    const form = document.getElementById(formId);
    const formData = new FormData(form);
    return Object.fromEntries(formData.entries());
}

export function resetForm(formId) {
    const form = document.getElementById(formId);
    form.reset();
    clearValidation(form);
}

export function clearValidation(form) {
    form.querySelectorAll('.is-invalid').forEach(input => {
        input.classList.remove('is-invalid');
    });
}

export function setFieldValidation(formId, fieldName, isValid, errorMessage = '') {
    const field = document.getElementById(formId).elements[fieldName];
    if (field) {
        field.classList.toggle('is-invalid', !isValid);
        const feedback = field.nextElementSibling;
        if (feedback && feedback.classList.contains('invalid-feedback')) {
            feedback.textContent = errorMessage;
        }
    }
}
 