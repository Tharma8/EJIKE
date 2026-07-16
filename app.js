const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const backToTop = document.querySelector('.back-to-top');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.2 }
);

reveals.forEach((el) => observer.observe(el));

const counters = document.querySelectorAll('.counter');
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const target = Number(entry.target.dataset.target || 0);
      let current = 0;
      const step = Math.max(1, Math.floor(target / 30));
      const timer = window.setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          window.clearInterval(timer);
        }
        entry.target.textContent = `${current}${target === 100 ? '%' : '+'}`;
      }, 35);
      counterObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.6 }
);

counters.forEach((counter) => counterObserver.observe(counter));

window.addEventListener('scroll', () => {
  if (window.scrollY > 540) {
    backToTop?.classList.add('visible');
  } else {
    backToTop?.classList.remove('visible');
  }
});

backToTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');

const tasks = [];

function renderTasks() {
  if (!taskList) return;

  taskList.innerHTML = '';

  tasks.forEach((task, index) => {
    const item = document.createElement('li');
    item.className = `task-item${task.completed ? ' completed' : ''}`;

    const label = document.createElement('span');
    label.textContent = task.name;

    const actions = document.createElement('div');
    actions.className = 'task-actions';

    const completeButton = document.createElement('button');
    completeButton.type = 'button';
    completeButton.textContent = task.completed ? 'Undo' : 'Complete';
    completeButton.addEventListener('click', () => {
      tasks[index].completed = !tasks[index].completed;
      renderTasks();
    });

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => {
      tasks.splice(index, 1);
      renderTasks();
    });

    actions.appendChild(completeButton);
    actions.appendChild(deleteButton);
    item.appendChild(label);
    item.appendChild(actions);
    taskList.appendChild(item);
  });
}

if (taskForm && taskInput && taskList) {
  taskForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const taskName = taskInput.value.trim();

    if (!taskName) {
      alert('Please enter a task name.');
      return;
    }

    tasks.push({ name: taskName, completed: false });
    taskInput.value = '';
    renderTasks();
  });

  renderTasks();
}

const contactForm = document.getElementById('contactForm');
const formErrors = document.getElementById('formErrors');
const formSuccess = document.getElementById('formSuccess');

if (contactForm && formErrors && formSuccess) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    formErrors.textContent = '';
    formSuccess.textContent = '';

    const formData = new FormData(contactForm);
    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const phone = String(formData.get('phone') || '').trim();
    const message = String(formData.get('message') || '').trim();

    const errors = [];

    if (!name || !email || !phone || !message) {
      errors.push('All fields are required.');
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailPattern.test(email)) {
      errors.push('Please enter a valid email address.');
    }

    if (phone && !/^\d+$/.test(phone)) {
      errors.push('Phone number must contain only digits.');
    }

    if (errors.length > 0) {
      formErrors.textContent = errors.join(' ');
      return;
    }

    formSuccess.textContent = 'Thank you! Your message has been sent.';
    contactForm.reset();
  });
}
