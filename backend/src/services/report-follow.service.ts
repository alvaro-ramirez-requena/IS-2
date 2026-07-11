import { ReportFollowRepository } from "../repositories/report-follow.repository";

export class ReportFollowService {
  private reportFollowRepository = new ReportFollowRepository();

  async followReport(userId: string, reportId: string) {
    return await this.reportFollowRepository.followReport(userId, reportId);
  }

  async unfollowReport(userId: string, reportId: string) {
    return await this.reportFollowRepository.unfollowReport(userId, reportId);
  }

  async isFollowing(userId: string, reportId: string) {
    const isFollowing = await this.reportFollowRepository.isFollowing(userId, reportId);

    return {
      isFollowing,
    };
  }

  async getFollowedReports(userId: string) {
    return await this.reportFollowRepository.findFollowedReportsByUser(userId);
  }
}
