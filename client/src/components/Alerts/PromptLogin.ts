import Swal from 'sweetalert2';

export const promptLoginSwal = async () => {
    const result = await Swal.fire({
        title: 'Your session has expired',
        text: 'Please login again',
        icon: 'error',
        confirmButtonText: 'Login'
    });

    if (result.isConfirmed) {
        window.location.href = '/';
    }
};
