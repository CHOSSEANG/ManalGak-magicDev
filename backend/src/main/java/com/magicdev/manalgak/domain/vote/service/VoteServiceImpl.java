package com.magicdev.manalgak.domain.vote.service;

import com.magicdev.manalgak.common.exception.BusinessException;
import com.magicdev.manalgak.common.exception.ErrorCode;
import com.magicdev.manalgak.domain.meeting.entity.Meeting;
import com.magicdev.manalgak.domain.meeting.repository.MeetingRepository;
import com.magicdev.manalgak.domain.participant.entity.Participant;
import com.magicdev.manalgak.domain.participant.repository.ParticipantRepository;
import com.magicdev.manalgak.domain.vote.dto.VoteCreateRequest;
import com.magicdev.manalgak.domain.vote.dto.VoteResponse;
import com.magicdev.manalgak.domain.vote.dto.VoteResultMessage;
import com.magicdev.manalgak.domain.vote.entity.Vote;
import com.magicdev.manalgak.domain.vote.entity.VoteOption;
import com.magicdev.manalgak.domain.vote.entity.VoteRecord;
import com.magicdev.manalgak.domain.vote.repository.VoteOptionRepository;
import com.magicdev.manalgak.domain.vote.repository.VoteRecordRepository;
import com.magicdev.manalgak.domain.vote.repository.VoteRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class VoteServiceImpl implements VoteService{

    private final VoteRepository voteRepository;
    private final VoteOptionRepository voteOptionRepository;
    private final VoteRecordRepository voteRecordRepository;
    private final MeetingRepository meetingRepository;
    private final ParticipantRepository participantRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Transactional
    @Override
    public Long createVote(Long meetingId, VoteCreateRequest request) {

        Meeting meeting = meetingRepository.findById(meetingId).orElseThrow(()->
                new BusinessException(ErrorCode.MEETING_NOT_FOUND));

        Vote vote = Vote.create(meeting);
        voteRepository.save(vote);
        request.getOptions().forEach(optionContent -> {
            VoteOption option = VoteOption.create(vote, optionContent);
            voteOptionRepository.save(option);
        });

        return vote.getId();
    }

    @Transactional
    @Override
    public VoteResponse getVote(Long voteId) {
        Vote vote = voteRepository.findById(voteId).orElseThrow(()->
                new BusinessException(ErrorCode.VOTE_NOT_FOUND));
        List<VoteOption> options = voteOptionRepository.findByVoteId(voteId);
        List<VoteRecord> records = voteRecordRepository.findByVoteId(voteId);
        return VoteResponse.from(vote, options,records);
    }

    @Transactional
    @Override
    public VoteResultMessage vote(Long voteId, Long optionId, Long userId) {

        log.info("voteId?={} optionId?={} userId?={}",voteId,optionId,userId);
        Vote vote = voteRepository.findById(voteId)
                .orElseThrow(() -> new BusinessException(ErrorCode.VOTE_NOT_FOUND));

        VoteOption option = voteOptionRepository.findById(optionId)
                .orElseThrow(() -> new BusinessException(ErrorCode.VOTE_OPTION_NOT_FOUND));

        Participant participant = participantRepository.findByMeeting_IdAndUser_Id(vote.getMeeting().getId(), userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.PARTICIPANT_NOT_FOUND));

        voteRecordRepository.findByVoteIdAndParticipantId(voteId, participant.getId())
                .ifPresentOrElse(
                        record -> {
                            if (!record.getVoteOption().getId().equals(optionId)) {
                                record.getVoteOption().decrease();
                                option.increase();
                                record.changeOption(option);
                            }
                        },
                        () -> {
                            option.increase();
                            voteRecordRepository.save(
                                    VoteRecord.create(vote, option, participant)
                            );
                        }
                );

        List<VoteOption> options = voteOptionRepository.findByVoteId(voteId);
        List<VoteRecord> records = voteRecordRepository.findByVoteId(voteId);

        VoteResultMessage result =
                VoteResultMessage.from(voteId, options, records);

        // 🔥 실시간 반영
        messagingTemplate.convertAndSend("/topic/votes/" + voteId, result);

        return result;
    }

    @Transactional(readOnly = true)
    public VoteResponse getVoteByMeetingId(Long meetingId) {
        List<Vote> votes = voteRepository.findByMeetingId(meetingId);

        if (votes.isEmpty()) {
            throw new BusinessException(ErrorCode.VOTE_NOT_FOUND);
        }

        Vote vote = votes.get(0);
        List<VoteOption> options = voteOptionRepository.findByVoteId(vote.getId());
        List<VoteRecord> records = voteRecordRepository.findByVoteId(vote.getId());
        return VoteResponse.from(vote, options,records);
    }

    @Transactional
    public VoteResponse getVoteByMeetingIdOrCreate(
            Long meetingId,
            VoteCreateRequest request
    ) {
        List<Vote> votes = voteRepository.findByMeetingId(meetingId);

        if (!votes.isEmpty()) {
            return getVote(votes.get(0).getId());
        }

        Long voteId = createVote(meetingId, request);
        return getVote(voteId);
    }

    @Transactional(readOnly = true)
    public List<Vote> getVotesByMeetingId(Long meetingId) {
        return voteRepository.findByMeetingId(meetingId);
    }
}

