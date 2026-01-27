package com.magicdev.manalgak.domain.meeting.service;

import com.magicdev.manalgak.common.exception.BusinessException;
import com.magicdev.manalgak.common.exception.ErrorCode;
import com.magicdev.manalgak.common.util.UuidGenerator;
import com.magicdev.manalgak.domain.meeting.dto.*;
import com.magicdev.manalgak.domain.meeting.entity.Meeting;
import com.magicdev.manalgak.domain.meeting.repository.MeetingRepository;
import com.magicdev.manalgak.domain.meeting.service.command.CreateMeetingCommand;
import com.magicdev.manalgak.domain.meeting.service.command.UpdateMeetingCommand;
import com.magicdev.manalgak.domain.participant.dto.ParticipantResponse;
import com.magicdev.manalgak.domain.participant.entity.Participant;
import com.magicdev.manalgak.domain.participant.repository.ParticipantRepository;
import com.magicdev.manalgak.domain.participant.service.ParticipantService;
import com.magicdev.manalgak.domain.place.dto.PlaceResponse;
import com.magicdev.manalgak.domain.place.entity.RecommendedPlace;
import com.magicdev.manalgak.domain.place.repository.RecommendedPlaceRepository;
import com.magicdev.manalgak.domain.user.entity.User;
import com.magicdev.manalgak.domain.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@Service
public class MeetingServiceImpl implements MeetingService {

    private final MeetingRepository meetingRepository;
    private final String frontendBaseUrl;
    private final ParticipantService participantService;
    private final ParticipantRepository participantRepository;
    private final UserRepository userRepository;
    private final RecommendedPlaceRepository recommendedPlaceRepository;

    public MeetingServiceImpl(
            MeetingRepository meetingRepository,
            @Value("${frontend.base-url}") String frontendBaseUrl,
            ParticipantService participantService,
            ParticipantRepository participantRepository,
            UserRepository userRepository,
            RecommendedPlaceRepository recommendedPlaceRepository
    ) {
        this.meetingRepository = meetingRepository;
        this.frontendBaseUrl = frontendBaseUrl;
        this.participantService = participantService;
        this.participantRepository = participantRepository;
        this.userRepository = userRepository;
        this.recommendedPlaceRepository = recommendedPlaceRepository;
    }

    @Override
    @Transactional
    public MeetingCreateResponse createMeeting(CreateMeetingCommand createMeetingCommand, Long userId) {
        Meeting meeting = createMeetingCommand.toEntity();
        String uuid = UuidGenerator.generate();
        meeting.setMeetingUuid(uuid);

        Meeting save = meetingRepository.save(meeting);
        String shareUrl = frontendBaseUrl + "/m/" + save.getMeetingUuid();

        participantService.joinMeeting(uuid, userId);
        return MeetingCreateResponse.from(save, shareUrl);
    }

    @Override
    public MeetingDetailResponse getMeeting(String meetingUuid) {
        Meeting meeting = meetingRepository.findByMeetingUuid(meetingUuid)
                .orElseThrow(() -> new BusinessException(ErrorCode.MEETING_NOT_FOUND));

        List<ParticipantResponse> participants = participantRepository.findByMeetingId(meeting.getId())
                .stream()
                .map(ParticipantResponse::from)
                .toList();

        // 선택된 장소 정보 조회
        PlaceResponse.Place selectedPlace = getSelectedPlace(meetingUuid);

        return MeetingDetailResponse.from(meeting, participants, selectedPlace);
    }


    @Override
    public Page<MeetingAllResponse> getAllMeetings(Long userId, Pageable pageable) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        List<Participant> userParticipants = participantRepository.findByUser(user);
        List<Long> meetingIds = userParticipants.stream()
                .map(p -> p.getMeeting().getId())
                .distinct()
                .toList();

        if (meetingIds.isEmpty()) {
            return Page.empty(pageable);
        }

        Page<Meeting> meetingsPage = meetingRepository.findByIdIn(
                meetingIds, PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(),
                        Sort.by(Sort.Direction.DESC, "meetingTime"))
        );

        List<Participant> allParticipants = participantRepository.findByMeetingIdIn(
                meetingsPage.getContent().stream().map(Meeting::getId).toList()
        );

        Map<Long, List<ParticipantResponse>> participantMap = allParticipants.stream()
                .map(ParticipantResponse::from)
                .collect(Collectors.groupingBy(ParticipantResponse::getMeetingId));

        List<MeetingAllResponse> responseList = meetingsPage.getContent().stream()
                .map(meeting -> {
                    List<ParticipantResponse> participants =
                            participantMap.getOrDefault(meeting.getId(), List.of());

                    // 선택된 장소 정보 조회
                    PlaceResponse.Place selectedPlace = getSelectedPlace(meeting.getMeetingUuid());

                    return MeetingAllResponse.from(meeting, participants, selectedPlace);
                })
                .toList();

        return new PageImpl<>(responseList, pageable, meetingsPage.getTotalElements());
    }

    /**
     * 선택된 장소 조회
     */
    @Transactional(readOnly = true)
    private PlaceResponse.Place getSelectedPlace(String meetingUuid) {
        RecommendedPlace recommendedPlace = recommendedPlaceRepository
                .findByMeetingMeetingUuid(meetingUuid)
                .orElse(null);

        if (recommendedPlace == null) {
            return null;
        }

        return convertToPlaceDto(recommendedPlace);
    }

    /**
     * RecommendedPlace를 PlaceResponse.Place로 변환
     */
    private PlaceResponse.Place convertToPlaceDto(RecommendedPlace recommendedPlace) {
        return PlaceResponse.Place.builder()
                .placeId(recommendedPlace.getPlaceId())
                .placeName(recommendedPlace.getPlaceName())
                .category(recommendedPlace.getCategory())
                .categoryGroupCode(recommendedPlace.getCategoryGroupCode())
                .categoryGroupName(recommendedPlace.getCategoryGroupName())
                .categoryName(null)  // RecommendedPlace에 없는 필드
                .address(recommendedPlace.getAddress())
                .roadAddress(recommendedPlace.getRoadAddress())
                .latitude(recommendedPlace.getLatitude())
                .longitude(recommendedPlace.getLongitude())
                .distance(recommendedPlace.getDistance())
                .walkingMinutes(recommendedPlace.getWalkingMinutes())
                .stationName(null)  // RecommendedPlace에 없는 필드
                .phone(recommendedPlace.getPhone())
                .placeUrl(recommendedPlace.getPlaceUrl())
                .build();
    }

    public Meeting getMeetingByMeetingUuid(String meetingUuid) {
        return meetingRepository.findByMeetingUuid(meetingUuid)
                .orElseThrow(() -> new BusinessException(ErrorCode.MEETING_NOT_FOUND));
    }


    @Override
    @Transactional
    public MeetingResponse updateMeeting(UpdateMeetingCommand updateMeetingCommand, String meetingUuid, Long userId) {
        Meeting meeting = getMeetingByMeetingUuid(meetingUuid);
        validateIsOrganizer(userId, meeting);
        meeting.update(updateMeetingCommand);
        return MeetingResponse.from(meeting);
    }


    @Transactional
    @Override
    public void deleteMeeting(String meetingUuid, Long userId) {
        Meeting meeting = getMeetingByMeetingUuid(meetingUuid);
        validateIsOrganizer(userId, meeting);
        participantRepository.deleteByMeeting(meeting);
        meetingRepository.delete(meeting);
    }

    private static void validateIsOrganizer(Long userId, Meeting meeting) {
        if (!meeting.getOrganizerId().equals(userId)) {
            throw new BusinessException(ErrorCode.MEETING_NOT_ORGANIZER);
        }
    }

    @Override
    public MeetingCopyResponse copyMeeting(String meetingUuid, Long userId) {

        Meeting oldMeeting = meetingRepository.findByMeetingUuid(meetingUuid).orElseThrow(() -> new BusinessException(ErrorCode.MEETING_NOT_FOUND));
        String uuid = UuidGenerator.generate();

        Meeting newMeeting = new Meeting();
        newMeeting.setMeetingName(oldMeeting.getMeetingName());
        newMeeting.setOrganizerId(userId);
        newMeeting.setStatus(Meeting.MeetingStatus.PENDING);
        newMeeting.setTotalParticipants(oldMeeting.getTotalParticipants());
        newMeeting.setMeetingUuid(uuid);

        Meeting savedMeeting = meetingRepository.save(newMeeting);

        List<ParticipantResponse> participantResponses = participantService.copyParticipant(oldMeeting, savedMeeting);

        String shareUrl = frontendBaseUrl + "/m/" + savedMeeting.getMeetingUuid();
        return MeetingCopyResponse.from(savedMeeting, participantResponses, shareUrl);
    }
}