var API_ENDPOINT = "https://1sz056mhs5.execute-api.us-east-1.amazonaws.com/dev/data"

// Process button click handler
document.getElementById("sayButton").onclick = function(){
  // Show loading state
  const button = document.getElementById("sayButton");
  const originalText = button.innerHTML;
  button.disabled = true;
  button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

  var inputData = {
    "voice": $('#voiceSelected option:selected').val(),
    "text" : $('#postText').val()
  };

  $.ajax({
    url: API_ENDPOINT,
    type: 'POST',
    data: JSON.stringify(inputData),
    contentType: 'application/json; charset=utf-8',
    success: function (response) {
      document.getElementById("postIDreturned").textContent = "Message: " + response;
      
      // Reset button state
      button.disabled = false;
      button.innerHTML = originalText;
      
      // Show success notification
      showNotification('Text converted successfully!', 'success');
      
      // Refresh the table to show the new entry
      document.getElementById("searchButton").click();
    },
    error: function () {
      // Reset button state
      button.disabled = false;
      button.innerHTML = originalText;
      
      // Show error notification
      showNotification('Error processing your request', 'error');
    }
  });
}

// Refresh table button click handler
document.getElementById("searchButton").onclick = function(){
  // Show loading state
  const button = document.getElementById("searchButton");
  const originalText = button.innerHTML;
  button.disabled = true;
  button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';

  $.ajax({
    url: API_ENDPOINT,
    type: 'GET',
    success: function (response) {
      // Clear existing table rows except header
      $('#posts tbody').empty();

      // Add new rows
      jQuery.each(response, function(i, data) {
        var player = "<audio controls><source src='" + data['url'] + "' type='audio/mpeg'></audio>"

        if (typeof data['url'] === "undefined") {
          var player = "<span class='no-audio'>No audio available</span>"
        }

        $("#posts tbody").append("<tr>\
          <td>" + data['selected voice'] + "</td> \
          <td>" + data['input text'] + "</td> \
          <td>" + data['status'] + "</td> \
          <td>" + player + "</td> \
        </tr>");
      });
      
      // Reset button state
      button.disabled = false;
      button.innerHTML = originalText;
      
      // Show success notification
      showNotification('Table refreshed', 'info');
    },
    error: function () {
      // Reset button state
      button.disabled = false;
      button.innerHTML = originalText;
      
      // Show error notification
      showNotification('Error refreshing table', 'error');
    }
  });
}

// Character counter
document.getElementById("postText").onkeyup = function(){
  var length = $(postText).val().length;
  document.getElementById("charCounter").textContent = "Characters: " + length;
  
  // Optional: Add visual feedback for character limit
  if (length > 500) {
    document.getElementById("charCounter").classList.add("warning");
  } else {
    document.getElementById("charCounter").classList.remove("warning");
  }
}

// Notification system
function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  
  // Add icon based on notification type
  let icon = 'info-circle';
  if (type === 'success') icon = 'check-circle';
  if (type === 'warning') icon = 'exclamation-triangle';
  if (type === 'error') icon = 'times-circle';
  
  notification.innerHTML = `
    <i class="fas fa-${icon}"></i>
    <span>${message}</span>
  `;
  
  // Add to document
  document.body.appendChild(notification);
  
  // Show with animation
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  // Remove after delay
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

// Add notification styles dynamically
const style = document.createElement('style');
style.textContent = `
  .notification {
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 12px 20px;
    background-color: #f8f9fa;
    color: #333;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    gap: 10px;
    transform: translateY(100px);
    opacity: 0;
    transition: all 0.3s ease;
    z-index: 1000;
  }
  
  .notification.show {
    transform: translateY(0);
    opacity: 1;
  }
  
  .notification.success {
    background-color: #d4edda;
    color: #155724;
  }
  
  .notification.info {
    background-color: #d1ecf1;
    color: #0c5460;
  }
  
  .notification.warning {
    background-color: #fff3cd;
    color: #856404;
  }
  
  .notification.error {
    background-color: #f8d7da;
    color: #721c24;
  }
  
  .notification i {
    font-size: 1.2rem;
  }
  
  .warning {
    color: #856404;
  }
  
  .no-audio {
    color: #721c24;
    font-style: italic;
  }
`;
document.head.appendChild(style);

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
  // Load existing posts on page load
  document.getElementById("searchButton").click();
});
