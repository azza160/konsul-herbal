import './bootstrap';
import Swal from 'sweetalert2';

// Global SweetAlert configuration
window.Swal = Swal;

// Handle flash messages
window.showFlashMessage = function(success, message) {
    Swal.fire({
        icon: success ? 'success' : 'error',
        title: success ? 'Berhasil!' : 'Gagal!',
        text: message,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true
    });
};
