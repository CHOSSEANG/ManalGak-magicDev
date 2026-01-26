package com.magicdev.manalgak.domain.vote.service;

import com.magicdev.manalgak.common.exception.BusinessException;
import com.magicdev.manalgak.common.exception.ErrorCode;
import com.magicdev.manalgak.domain.meeting.entity.Meeting;
import com.magicdev.manalgak.domain.meeting.repository.MeetingRepository;
import com.magicdev.manalgak.domain.participant.entity.Participant;
import com.magicdev.manalgak.domain.participant.repository.ParticipantRepository;
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
import java.util.Optional;

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

        messagingTemplate.convertAndSend("/topic/votes/" + voteId, result);

        return result;
    }

    @Transactional(readOnly = true)
    public VoteResponse getVoteByMeetingUuid(String meetingUuid) {
        Optional<Vote> voteOpt = voteRepository.findFirstByMeeting_MeetingUuid(meetingUuid);

        if (voteOpt.isEmpty()) {
            // 투표가 없으면 빈 VoteResponse 반환
            return VoteResponse.empty(); // null이 아니라 안전한 빈 객체
        }

        Vote vote = voteOpt.get();
        List<VoteOption> options = voteOptionRepository.findByVoteId(vote.getId());
        List<VoteRecord> records = voteRecordRepository.findByVoteId(vote.getId());
        return VoteResponse.from(vote, options, records);
    }

    @Transactional
    public VoteResponse createVote(
            String meetingUuid,
            List<String> options
    ) {
        Optional<Vote> existingVote = voteRepository.findFirstByMeeting_MeetingUuid(meetingUuid);

        if (existingVote.isPresent()) {
            throw new BusinessException(ErrorCode.VOTE_ALREADY_EXISTS);
        }

        Meeting meeting = meetingRepository.findByMeetingUuid(meetingUuid).orElseThrow(()->
                new BusinessException(ErrorCode.MEETING_NOT_FOUND));

        Vote vote = Vote.create(meeting);
        voteRepository.save(vote);
        List<VoteOption> optionsToSave = options.stream()
                .map(optionContent -> VoteOption.create(vote, optionContent))
                .toList();
        voteOptionRepository.saveAll(optionsToSave);

        // 🔥 생성된 투표 응답
        VoteResponse response = getVote(vote.getId());

        // 🔥🔥🔥 여기 핵심
        messagingTemplate.convertAndSend(
                "/topic/meeting/" + meetingUuid + "/vote-created",
                response
        );
        return response;
    }

}

