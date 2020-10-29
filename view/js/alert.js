$(document).ready(function () {
  Swal.fire({
    toast: true,
    title: 'Выберите преподавателя',
    icon: 'info',
    showConfirmButton: false,
    background: '#131316',
    iconColor: '#EA2E2E',
    timer: 4000,
    showClass: {
      popup: 'fade-in-vertical',
    },
    hideClass: {
      popup: 'fade-out-vertical',
    },
    position: 'top',
  })
})
