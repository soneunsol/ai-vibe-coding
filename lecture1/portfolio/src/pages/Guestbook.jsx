import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Divider,
  Card,
  CardContent,
  TextField,
  Button,
  Alert,
  Skeleton,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

import {
  fetchGuestbookEntries,
  createGuestbookEntry,
  IS_TEMPORARY_DATA,
  NICKNAME_MAX_LENGTH,
  MESSAGE_MAX_LENGTH,
} from '../services/guestbook';

const EMPTY_FORM = { nickname: '', message: '' };

/**
 * 작성 시각을 상대 시간으로 바꾼다. (예: '3일 전')
 *
 * @param {string} isoDate - ISO 8601 형식의 작성 시각
 * @returns {string} 사람이 읽기 쉬운 상대 시간
 */
const formatRelativeTime = (isoDate) => {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.floor(diffMs / 60000);

  if (minutes < 1) return '방금 전';
  if (minutes < 60) return `${minutes}분 전`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}일 전`;

  return new Date(isoDate).toLocaleDateString('ko-KR');
};

/** 목록을 불러오는 동안 자리를 잡아두는 스켈레톤 카드 */
const SkeletonEntry = () => (
  <Card>
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
        <Skeleton variant="circular" width={40} height={40} />
        <Box sx={{ flexGrow: 1 }}>
          <Skeleton variant="text" width={120} />
          <Skeleton variant="text" width={64} />
        </Box>
      </Box>
      <Skeleton variant="text" />
      <Skeleton variant="text" width="70%" />
    </CardContent>
  </Card>
);

/**
 * Guestbook 페이지
 * 방문객이 남긴 방명록을 최신순으로 보여주고, 새 글을 남길 수 있다.
 *
 * Example usage:
 * <Route path="/guestbook" element={<Guestbook />} />
 */
const Guestbook = () => {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const loadEntries = async () => {
      try {
        setEntries(await fetchGuestbookEntries());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadEntries();
  }, []);

  const handleChange = ({ target: { name, value } }) =>
    setForm((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const created = await createGuestbookEntry(form);

      /** 최신순 목록이므로 새 글을 맨 앞에 붙인다. */
      setEntries((prev) => [created, ...prev]);
      setForm(EMPTY_FORM);
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const isFormFilled = form.nickname.trim() !== '' && form.message.trim() !== '';

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
            Leave A Message
          </Typography>
          <Typography
            variant="h1"
            sx={{
              color: '#fff',
              fontWeight: 700,
              textShadow: '0 0 20px rgba(123,47,247,0.5)',
              mb: 2,
            }}
          >
            Guestbook
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
            방문해주셔서 감사합니다. 짧은 한마디를 남겨주세요.
          </Typography>
        </Box>

        {/* 작성 폼 */}
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h3" sx={{ color: '#fff', fontWeight: 600, mb: 2 }}>
              방명록 남기기
            </Typography>
            <Divider sx={{ mb: IS_TEMPORARY_DATA ? 2 : 3 }} />

            {/* 저장되는 것으로 오해하지 않도록 임시 동작임을 먼저 알린다 */}
            {IS_TEMPORARY_DATA && (
              <Typography
                variant="caption"
                sx={{ display: 'block', color: 'rgba(220,215,255,0.55)', mb: 3 }}
              >
                ※ 현재 방명록은 데모용 임시 데이터로 동작합니다. 남기신 글은 이 화면에서만 보이며
                새로고침하면 사라집니다.
              </Typography>
            )}

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
                {IS_TEMPORARY_DATA
                  ? '방명록이 화면에 추가되었습니다. 감사합니다!'
                  : '방명록이 등록되었습니다. 감사합니다!'}
              </Alert>
            )}

            {submitError && (
              <Alert
                severity="error"
                sx={{
                  mb: 3,
                  background: 'rgba(255, 60, 172, 0.1)',
                  border: '1px solid rgba(255, 60, 172, 0.3)',
                  color: '#ff3cac',
                }}
                onClose={() => setSubmitError(null)}
              >
                등록에 실패했습니다. ({submitError})
              </Alert>
            )}

            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}
            >
              <TextField
                label="닉네임"
                name="nickname"
                value={form.nickname}
                onChange={handleChange}
                variant="outlined"
                required
                fullWidth
                slotProps={{ htmlInput: { maxLength: NICKNAME_MAX_LENGTH } }}
                helperText={`${form.nickname.length} / ${NICKNAME_MAX_LENGTH}`}
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
                rows={3}
                slotProps={{ htmlInput: { maxLength: MESSAGE_MAX_LENGTH } }}
                helperText={`${form.message.length} / ${MESSAGE_MAX_LENGTH}`}
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                endIcon={<SendIcon />}
                disabled={!isFormFilled || submitting}
                sx={{ alignSelf: 'flex-end', px: 4 }}
              >
                {submitting ? '등록 중...' : '남기기'}
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* 목록 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <ChatBubbleOutlineIcon sx={{ fontSize: 18, color: '#c084fc' }} />
          <Typography variant="body2" sx={{ color: 'rgba(220,215,255,0.75)' }}>
            {loading ? '불러오는 중...' : `${entries.length}개의 방명록`}
          </Typography>
        </Box>

        {error && (
          <Alert
            severity="error"
            sx={{
              background: 'rgba(255, 60, 172, 0.1)',
              border: '1px solid rgba(255, 60, 172, 0.3)',
              color: '#ff3cac',
            }}
          >
            방명록을 불러오지 못했습니다. ({error})
          </Alert>
        )}

        {!error && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {loading && [0, 1, 2].map((key) => <SkeletonEntry key={key} />)}

            {!loading && entries.length === 0 && (
              <Card>
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Typography variant="body1" sx={{ color: 'rgba(220,215,255,0.7)' }}>
                    아직 방명록이 없습니다. 첫 번째 글을 남겨주세요!
                  </Typography>
                </CardContent>
              </Card>
            )}

            {!loading && entries.map(({ id, nickname, message, created_at: createdAt }) => (
              <Card key={id}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        flexShrink: 0,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        color: '#fff',
                        background: 'linear-gradient(135deg, #c084fc, #00c8ff)',
                        boxShadow: '0 4px 16px rgba(123, 47, 247, 0.35)',
                      }}
                    >
                      {nickname.slice(0, 1)}
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        variant="body1"
                        sx={{ color: '#fff', fontWeight: 600, lineHeight: 1.3 }}
                      >
                        {nickname}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(220,215,255,0.55)' }}>
                        {formatRelativeTime(createdAt)}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography
                    variant="body1"
                    sx={{
                      color: 'rgba(220,215,255,0.9)',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                    }}
                  >
                    {message}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Guestbook;
