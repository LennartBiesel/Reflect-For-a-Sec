// content.js

  function createModal(title, content, buttons) {
      const modal = document.createElement('div');
      modal.className = 'yt-reflection-modal';
      
      const modalContent = `
        <div class="yt-reflection-content">
          <h2>${title}</h2>
          ${content}
          <div class="yt-reflection-buttons">
            ${buttons.map(btn => `
              <button class="${btn.class}" data-action="${btn.action}">
                ${btn.text}
              </button>
            `).join('')}
          </div>
        </div>
      `;
      
      modal.innerHTML = modalContent;
      
      if (!document.querySelector('#yt-reflection-styles')) {
        const style = document.createElement('style');
        style.id = 'yt-reflection-styles';
        style.textContent = `
          .yt-reflection-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
          }
          .yt-reflection-content {
            background: white;
            padding: 20px;
            border-radius: 8px;
            width: 1000px;
            max-width: 90%;
          }
          .yt-reflection-content textarea {
            width: 100%;
            min-height: 400px;
            margin: 10px 0;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
          }
          .yt-reflection-buttons {
            display: flex;
            gap: 10px;
            justify-content: flex-end;
            margin-top: 15px;
          }
          .yt-reflection-buttons button {
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }
          .primary-button {
            background: #ff0000;
            color: white;
          }
          .secondary-button {
            background: #f2f2f2;
            color: #666;
          }
          .question-text {
            font-size: 18px;
            margin-bottom: 20px;
          }
          .sub-text {
            font-size: 14px;
            color: #666;
            margin-bottom: 20px;
          }
        `;
        document.head.appendChild(style);
      }
      
      return modal;
    }
  
  function showEntertainmentQuestion(href) {
    const modal = createModal(
      'Quick Question',
      `
        <p class="question-text">Is this video pure entertainment?</p>
      `,
      [
        { text: 'Cancel', action: 'cancel', class: 'secondary-button' },
        { text: 'No', action: 'not-entertainment', class: 'secondary-button' },
        { text: 'Yes', action: 'entertainment', class: 'primary-button' },
      ]
    );
  
    document.body.appendChild(modal);
  
    modal.addEventListener('click', (e) => {
      const button = e.target.closest('button');
      if (!button) return;
  
      if (button.dataset.action === 'cancel') {
        modal.remove();
      } else if (button.dataset.action === 'entertainment') {
        modal.remove();
        showEnjoymentQuestion(href);
      } else if (button.dataset.action === 'not-entertainment') {
        modal.remove();
        showNonEntertainmentReflection(href);
      }
    });
  }
  
  function showEnjoymentQuestion(href) {
    const modal = createModal(
      'One More Thing',
      `
        <p class="question-text">Will you totally enjoy it, or is it just a distraction?</p>
      `,
      [
        { text: 'Cancel', action: 'cancel', class: 'secondary-button' },
        { text: 'Just a Distraction', action: 'distraction', class: 'secondary-button' },
        { text: 'Will Enjoy', action: 'enjoy', class: 'primary-button' }
      ]
    );
  
    document.body.appendChild(modal);
  
    modal.addEventListener('click', (e) => {
      const button = e.target.closest('button');
      if (!button) return;
  
      if (button.dataset.action === 'cancel') {
        modal.remove();
      } else if (button.dataset.action === 'enjoy') {
        modal.remove();
        showEnjoymentReflection(href);
      } else if (button.dataset.action === 'distraction') {
        modal.remove();
        showDistractionReflection(href);
      }
    });
  }
  
  function showReflectionModal(href, title, question, subtext) {
    const modal = createModal(
      title,
      `
        <p class="question-text">${question}</p>
        <p class="sub-text">${subtext}</p>
        <textarea required placeholder="Take a moment to reflect..."></textarea>
      `,
      [
        { text: 'Cancel', action: 'cancel', class: 'secondary-button' },
        { text: 'Continue to Video', action: 'continue', class: 'primary-button' }
      ]
    );
  
    document.body.appendChild(modal);
  
    modal.addEventListener('click', (e) => {
      const button = e.target.closest('button');
      if (!button) return;
  
      if (button.dataset.action === 'cancel') {
        modal.remove();
      } else if (button.dataset.action === 'continue') {
        const reflection = modal.querySelector('textarea').value;
        if (!reflection.trim()) return;
  
        chrome.storage.local.set({
          [href]: {
            reflection: reflection,
            timestamp: new Date().toISOString()
          }
        });
  
        modal.remove();
        window.location.href = href;
      }
    });
  }
  
  function showNonEntertainmentReflection(href) {
    showReflectionModal(
      href,
      'Before you watch...',
      'What are you hoping to get from this video?',
      'Take a moment to reflect on how this content might influence you.'
    );
  }
  
  function showEnjoymentReflection(href) {
    showReflectionModal(
      href,
      'Before you enjoy...',
      'What are you hoping to get from this entertainment?',
      'Even entertainment shapes our thoughts and behavior.'
    );
  }
  
  function showDistractionReflection(href) {
    showReflectionModal(
      href,
      'A moment of honesty...',
      'What are you hoping this distracts you from?',
      'Will it succeed at that?'
    );
  }
  
  function handleClick(event) {
    const videoLink = event.target.closest('a');
    if (!videoLink) return;
  
    const href = videoLink.href;
    if (!href || !href.includes('/watch?v=')) return;
  
    event.preventDefault();
    event.stopPropagation();
  
    if (!sessionStorage.getItem('videoPromptShown')) {
      sessionStorage.setItem('videoPromptShown', 'true');
      showEntertainmentQuestion(href);
    }
  }
  
  function pauseVideo() {
    const video = document.querySelector('video');
    if (video) {
      video.pause();
    }
  }

  function showEntertainmentQuestionWithPause(href) {
    pauseVideo();
    showEntertainmentQuestion(href);
  }


  // Add click listener for video links
  document.addEventListener('click', handleClick, true); 
  // Add a load event listener to handle opening the video in a new tab
  window.addEventListener('load', () => {
    const href = window.location.href;
    if (href.includes('/watch?v=') || href.includes('/shorts/')) {
      if (!sessionStorage.getItem('videoPromptShown')) {
        sessionStorage.setItem('videoPromptShown', 'true');
        showEntertainmentQuestionWithPause(href);
      }
    }
  });