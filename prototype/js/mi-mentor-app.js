/**
 * Mi Mentor — entrada standalone (Figma 13707:13164)
 */
(function () {
  if (!window.SeccionMentor || !window.FIGMA_4_1) return;

  function resolveAssignedMentorId() {
    return (
      sessionStorage.getItem('selectedMentorId') ||
      window.FIGMA_HOME?.mentorAppointment?.mentorId ||
      window.FIGMA_MI_MENTOR?.defaultMentorId ||
      null
    );
  }

  function getMentor(id) {
    return window.FIGMA_4_1.mentors.find((m) => m.id === id) || null;
  }

  function bindNavbar() {
    const navbarRoot = document.querySelector('#mi-mentor-navbar .navbar');
    if (!navbarRoot || !window.Navbar) return;
    window.Navbar.bindTabNavigation(navbarRoot, window.Navbar.getSiblingTabRoutes(), 'mentor');
  }

  function mount() {
    const mentorId = resolveAssignedMentorId();
    const mentor = getMentor(mentorId) || window.FIGMA_4_1.mentors[0];

    SeccionMentor.mount(document.getElementById('mi-mentor-root'), mentor);
    bindNavbar();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
