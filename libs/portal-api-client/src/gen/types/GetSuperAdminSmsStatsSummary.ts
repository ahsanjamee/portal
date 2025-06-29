export type GetSuperAdminSmsStatsSummaryQueryParams = {
  /**
   * @type string | undefined
   */
  startDate?: string;
  /**
   * @type string | undefined
   */
  endDate?: string;
};
export type GetSuperAdminSmsStatsSummary200 = {
  /**
   * @type number
   */
  total: number;
  /**
   * @type number
   */
  successful: number;
  /**
   * @type number
   */
  failed: number;
  /**
   * @type number
   */
  otpCount: number;
  /**
   * @type number
   */
  adminNotificationCount: number;
  /**
   * @type number
   */
  endUserNotificationCount: number;
  /**
   * @type number
   */
  broadcastCount: number;
  /**
   * @type number
   */
  successRate: number;
  /**
   * @type number
   */
  failureRate: number;
};
export type GetSuperAdminSmsStatsSummaryQueryResponse = {
  /**
   * @type number
   */
  total: number;
  /**
   * @type number
   */
  successful: number;
  /**
   * @type number
   */
  failed: number;
  /**
   * @type number
   */
  otpCount: number;
  /**
   * @type number
   */
  adminNotificationCount: number;
  /**
   * @type number
   */
  endUserNotificationCount: number;
  /**
   * @type number
   */
  broadcastCount: number;
  /**
   * @type number
   */
  successRate: number;
  /**
   * @type number
   */
  failureRate: number;
};
export type GetSuperAdminSmsStatsSummaryQuery = {
  Response: GetSuperAdminSmsStatsSummaryQueryResponse;
  QueryParams: GetSuperAdminSmsStatsSummaryQueryParams;
};
