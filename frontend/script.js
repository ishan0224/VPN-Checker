document.addEventListener('DOMContentLoaded', function() {
    const checkBtn = document.getElementById('checkBtn');
    const ipAddressInput = document.getElementById('ipAddress');
    const resultDiv = document.getElementById('result');
  
    ipAddressInput.addEventListener("keypress",function(e){
        
    })
    checkBtn.addEventListener('click', function() {
      const ipAddress = ipAddressInput.value.trim();
  
      if (!ipAddress) {
        resultDiv.textContent = 'Please enter an IP address';
        return;
      }
  
      fetch('http://localhost:3000/check-vpn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ip: ipAddress })
      })
      .then(response => response.json())
      .then(data => {
        const isInVpn = data.isInVpn;
        resultDiv.textContent = `IP Address: ${ipAddress} is ${isInVpn ? 'in' : 'not in'} VPN`;
      })
      .catch(error => {
        console.error('Error occurred:', error);
        resultDiv.textContent = 'An error occurred while checking VPN';
      });
    });
  });
  