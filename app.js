const API_URL = 'http://localhost:5000/api/providers';

// Automatically load profiles from MongoDB as soon as the page boots up
document.addEventListener('DOMContentLoaded', fetchProviders);

// 1. GET Request: Fetch and display profiles
async function fetchProviders() {
  try {
    const response = await fetch(API_URL);
    const providers = await response.json();
    
    const container = document.getElementById('providersContainer');
    container.innerHTML = ''; // Clear temporary loading message

    if (providers.length === 0) {
      container.innerHTML = '<p style="color: #64748b;">No profiles found in database. Create one on the left!</p>';
      return;
    }

    // Loop through records and generate interface cards
    providers.forEach(provider => {
      const card = document.createElement('div');
      card.className = 'profile-card';
      card.innerHTML = `
        <h3>${provider.name}</h3>
        <p><span class="badge">${provider.skill}</span> 📍 <strong>${provider.location}</strong></p>
        <p style="font-size: 0.9rem; color: #475569;">${provider.bio || 'No bio provided.'}</p>
        <small style="color: #64748b;">📞 ${provider.phoneNumber}</small>
        <br>
        <button class="delete-btn" onclick="deleteProvider('${provider._id}')">Remove Profile</button>
      `;
      container.appendChild(card);
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    document.getElementById('providersContainer').innerHTML = '<p style="color: #ef4444;">Error connecting to backend server.</p>';
  }
}

// 2. POST Request: Submit new profile form data to backend
document.getElementById('providerForm').addEventListener('submit', async (e) => {
  e.preventDefault(); // Stop standard page refreshing

  const newProfile = {
    name: document.getElementById('name').value,
    skill: document.getElementById('skill').value,
    location: document.getElementById('location').value,
    phoneNumber: document.getElementById('phoneNumber').value,
    bio: document.getElementById('bio').value
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProfile)
    });

    if (response.ok) {
      document.getElementById('providerForm').reset(); // Clear input boxes
      fetchProviders(); // Instantly refresh the cards list with the new addition!
    } else {
      alert('Failed to save profile details.');
    }
  } catch (error) {
    console.error('Submission error:', error);
  }
});

// 3. DELETE Request: Delete profile from DB using button
async function deleteProvider(id) {
  if (!confirm('Are you sure you want to delete this professional profile?')) return;

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      fetchProviders(); // Refresh list immediately to show the profile is gone
    } else {
      alert('Could not remove profile entry.');
    }
  } catch (error) {
    console.error('Delete execution error:', error);
  }
}