const axios = require('axios');

// Calendly API configuration
const CALENDLY_API_BASE = 'https://api.calendly.com';
const CALENDLY_ACCESS_TOKEN = process.env.CALENDLY_ACCESS_TOKEN;

// Create Calendly headers
const getCalendlyHeaders = () => ({
  'Authorization': `Bearer ${CALENDLY_ACCESS_TOKEN}`,
  'Content-Type': 'application/json'
});

// Get user information
const getCalendlyUser = async () => {
  try {
    const response = await axios.get(`${CALENDLY_API_BASE}/users/me`, {
      headers: getCalendlyHeaders()
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Get Calendly user error:', error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
};

// Get event types
const getEventTypes = async (userUri) => {
  try {
    const response = await axios.get(`${CALENDLY_API_BASE}/event_types`, {
      headers: getCalendlyHeaders(),
      params: {
        user: userUri
      }
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Get event types error:', error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
};

// Create event type
const createEventType = async (userUri, eventTypeData) => {
  try {
    const response = await axios.post(`${CALENDLY_API_BASE}/event_types`, {
      name: eventTypeData.name,
      duration: eventTypeData.duration || 60,
      description: eventTypeData.description,
      location: eventTypeData.location,
      user: userUri,
      scheduling_url: eventTypeData.scheduling_url
    }, {
      headers: getCalendlyHeaders()
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Create event type error:', error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
};

// Get scheduled events
const getScheduledEvents = async (userUri, options = {}) => {
  try {
    const params = {
      user: userUri,
      ...options
    };

    const response = await axios.get(`${CALENDLY_API_BASE}/scheduled_events`, {
      headers: getCalendlyHeaders(),
      params
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Get scheduled events error:', error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
};

// Get event details
const getEventDetails = async (eventUri) => {
  try {
    const response = await axios.get(`${CALENDLY_API_BASE}/scheduled_events/${eventUri}`, {
      headers: getCalendlyHeaders()
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Get event details error:', error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
};

// Get invitee details
const getInviteeDetails = async (inviteeUri) => {
  try {
    const response = await axios.get(`${CALENDLY_API_BASE}/invitees/${inviteeUri}`, {
      headers: getCalendlyHeaders()
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Get invitee details error:', error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
};

// Cancel scheduled event
const cancelScheduledEvent = async (eventUri, reason = '') => {
  try {
    const response = await axios.post(`${CALENDLY_API_BASE}/scheduled_events/${eventUri}/cancellation`, {
      reason
    }, {
      headers: getCalendlyHeaders()
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Cancel scheduled event error:', error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
};

// Generate meeting link for specific event type
const generateMeetingLink = async (eventTypeUri, meetingData) => {
  try {
    // For Calendly, we typically use the public scheduling page URL
    // The eventTypeUri contains the scheduling URL
    const baseUrl = eventTypeUri.replace('/event_types/', '/');
    
    // Add custom parameters if needed
    const params = new URLSearchParams();
    if (meetingData.name) params.append('name', meetingData.name);
    if (meetingData.email) params.append('email', meetingData.email);
    if (meetingData.phone) params.append('phone', meetingData.phone);
    
    const meetingLink = `${baseUrl}?${params.toString()}`;
    
    return { success: true, link: meetingLink };
  } catch (error) {
    console.error('Generate meeting link error:', error);
    return { success: false, error: error.message };
  }
};

// Process Calendly webhook
const processCalendlyWebhook = async (webhookData) => {
  try {
    const { event, payload } = webhookData;
    
    switch (event) {
      case 'invitee.created':
        return await handleInviteeCreated(payload);
      case 'invitee.canceled':
        return await handleInviteeCanceled(payload);
      default:
        console.log('Unhandled Calendly webhook event:', event);
        return { success: true, message: 'Event not handled' };
    }
  } catch (error) {
    console.error('Process Calendly webhook error:', error);
    return { success: false, error: error.message };
  }
};

// Handle invitee created event
const handleInviteeCreated = async (payload) => {
  try {
    const {
      name,
      email,
      questions_and_answers,
      event: eventData,
      uri: inviteeUri
    } = payload;

    // Extract custom fields
    const customFields = {};
    if (questions_and_answers) {
      questions_and_answers.forEach(qa => {
        const question = qa.question.toLowerCase();
        if (question.includes('whatsapp') || question.includes('wa')) {
          customFields.no_wa = qa.answer;
        }
        if (question.includes('pekerjaan') || question.includes('job')) {
          customFields.pekerjaan = qa.answer;
        }
        if (question.includes('company') || question.includes('perusahaan')) {
          customFields.perusahaan = qa.answer;
        }
      });
    }

    return {
      success: true,
      data: {
        invitee_uri: inviteeUri,
        name,
        email,
        custom_fields: customFields,
        event_start: eventData.start_time,
        event_end: eventData.end_time,
        event_uri: eventData.uri
      }
    };
  } catch (error) {
    console.error('Handle invitee created error:', error);
    return { success: false, error: error.message };
  }
};

// Handle invitee canceled event
const handleInviteeCanceled = async (payload) => {
  try {
    const {
      name,
      email,
      event: eventData,
      uri: inviteeUri,
      cancellation
    } = payload;

    return {
      success: true,
      data: {
        invitee_uri: inviteeUri,
        name,
        email,
        event_uri: eventData.uri,
        canceled_at: cancellation.created_at,
        cancel_reason: cancellation.reason
      }
    };
  } catch (error) {
    console.error('Handle invitee canceled error:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  getCalendlyUser,
  getEventTypes,
  createEventType,
  getScheduledEvents,
  getEventDetails,
  getInviteeDetails,
  cancelScheduledEvent,
  generateMeetingLink,
  processCalendlyWebhook
};