import { useState } from 'react';

const useProfileForm = (initialEmail, userId, apiBase, onSuccessUpdate) => {
  const [formData, setFormData] = useState({
    email: initialEmail || '',
    newPassword: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.email) {
      setError('Email is required.');
      return;
    }

    if (formData.newPassword || formData.confirmPassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        setError('New passwords do not match');
        return;
      }
    }

    try {
      setLoading(true);
      const response = await fetch(`${apiBase}/api/users/profile/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.newPassword || undefined
        })
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        if (formData.email !== initialEmail && typeof onSuccessUpdate === 'function') {
          onSuccessUpdate(formData.email);
        }

        setSuccess(data.message || 'Profile updated successfully');
        setIsEditing(false);
        setFormData((prev) => ({
          ...prev,
          newPassword: '',
          confirmPassword: ''
        }));
      } else {
        setError(data.message || 'Update failed');
      }
    } catch (err) {
      console.error('Update error:', err);
      setLoading(false);
      setError('Error connecting to server. Please try again.');
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setError('');
    setSuccess('');
    setFormData({
      email: initialEmail,
      newPassword: '',
      confirmPassword: ''
    });
  };

  return {
    formData,
    error,
    success,
    loading,
    isEditing,
    setIsEditing,
    handleInputChange,
    handleSubmit,
    cancelEdit
  };
};

export default useProfileForm;
