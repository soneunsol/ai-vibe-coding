import React, { useState } from 'react';
import {
  Box,
  Typography,
  Divider,
  Card,
  CardContent,
  TextField,
  Button,
  Alert,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import GitHubIcon from '@mui/icons-material/GitHub';
import SendIcon from '@mui/icons-material/Send';

const SNS_LINKS = [
  {
    icon: <GitHubIcon sx={{ color: '#c084fc' }} />,
    label: 'GitHub',
    value: 'github.com/example',
    href: 'https://github.com/example',
  },
  {
    icon: <EmailIcon sx={{ color: '#ff3cac' }} />,
    label: 'Email',
    value: 'your-email@example.com',
    href: 'mailto:your-email@example.com',
  },
];

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = ({ target: { name, value } }) =>
    setForm((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        justifyContent: 'center',
        px: 2,
        py: 6,
      }}
    >
      <Box sx={{ maxWidth: 720, width: '100%' }}>

        {/* 헤더 */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="caption"
            sx={{ letterSpacing: 4, color: '#00c8ff', display: 'block', mb: 1, textTransform: 'uppercase' }}
          >
            Get In Touch
          </Typography>
          <Typography
            variant="h1"
            sx={{
              color: '#fff',
              fontWeight: 700,
              fontSize: { xs: '1.75rem', md: '2.125rem' },
              textShadow: '0 0 20px rgba(123,47,247,0.5)',
              mb: 2,
            }}
          >
            Contact
          </Typography>
          <Box
            sx={{
              width: 56,
              height: 2,
              background: 'linear-gradient(90deg, #7b2ff7, #00c8ff)',
              borderRadius: 1,
              mx: 'auto',
              mb: 2,
            }}
          />
          <Typography variant="body1" sx={{ color: 'rgba(220,215,255,0.7)' }}>
            프로젝트 협업이나 문의사항이 있으시면 연락주세요.
          </Typography>
        </Box>

        {/* SNS 링크 */}
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
            <Typography variant="h3" sx={{ color: '#fff', fontWeight: 600, mb: 2 }}>
              연락처
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              {SNS_LINKS.map(({ icon, label, value, href }) => (
                <Box
                  key={label}
                  component="a"
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    textDecoration: 'none',
                    p: 1.5,
                    borderRadius: 2,
                    border: '1px solid rgba(160,120,255,0.15)',
                    transition: 'background 0.2s, border-color 0.2s',
                    '&:hover': {
                      background: 'rgba(123,47,247,0.1)',
                      borderColor: 'rgba(160,120,255,0.35)',
                    },
                  }}
                >
                  {icon}
                  <Box>
                    <Typography variant="body2" sx={{ color: 'rgba(220,215,255,0.55)', lineHeight: 1 }}>
                      {label}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'rgba(220,215,255,0.9)', mt: 0.25 }}>
                      {value}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>

        {/* 메시지 폼 */}
        <Card>
          <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
            <Typography variant="h3" sx={{ color: '#fff', fontWeight: 600, mb: 2 }}>
              메시지 보내기
            </Typography>
            <Divider sx={{ mb: 3 }} />

            {submitted && (
              <Alert
                severity="success"
                sx={{
                  mb: 3,
                  background: 'rgba(0, 255, 135, 0.1)',
                  border: '1px solid rgba(0, 255, 135, 0.3)',
                  color: '#00ff87',
                }}
                onClose={() => setSubmitted(false)}
              >
                메시지가 전송되었습니다. 감사합니다!
              </Alert>
            )}

            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}
            >
              <TextField
                label="이름"
                name="name"
                value={form.name}
                onChange={handleChange}
                variant="outlined"
                required
                fullWidth
              />
              <TextField
                label="이메일"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                variant="outlined"
                required
                fullWidth
              />
              <TextField
                label="메시지"
                name="message"
                value={form.message}
                onChange={handleChange}
                variant="outlined"
                required
                fullWidth
                multiline
                rows={4}
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                endIcon={<SendIcon />}
                sx={{ alignSelf: 'flex-end', px: 4 }}
              >
                전송
              </Button>
            </Box>
          </CardContent>
        </Card>

      </Box>
    </Box>
  );
};

export default Contact;
