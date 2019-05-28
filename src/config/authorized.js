/**
 * 身分驗證組件
 * 輸出的方法包含了驗證邏輯的執行內容，其中會傳入兩個參數並回傳一個布林值做為是否通過驗證的基準
 * state: 當前dva狀態樹
 * params: 使用者傳入的驗證參數
 *
 * 方法名稱會自動轉換為Authorized中的組件內容
 * 首字母小寫為修飾器，首字母大寫為組件，以$開頭為驗證函數
 * 舉例來說，isLogin方法會自動在Authorized中產生isLogin修飾器、IsLogin組件以及$isLogin函數提供驗證，使用方法如下
 *
 * 修飾器用法:
 * 不帶任何參數及設定值
 * @Authorized.isLogin()
 *
 * 帶有參數，並套用設定值
 * @Authorized.isLogin(params, {
 *  fail: ReactNode
 * })
 *
 * 不帶有參數，並套用設定值
 * @Authorized.isLogin({
 *  noParams: true,
 *  fail: ReactNode
 * })
 *
 * 組件用法:
 * <Authorized.IsLogin params={} fail={ReactNode}>
 *  {pass:ReactNode}
 * </Authorized.IsLogin>
 *
 * 函數用法：
 * Authorized.$isLogin(params) // return boolean
 *
 */
import _ from 'lodash';

export default {
  isLogin: (state) => !_.isNull(_.get(state, 'auth.token', null)),
  isGuest: (state) => _.isNull(_.get(state, 'auth.token', null)),
  hasPermission: (state, _requirePermissions) => {
    if (_.isNull(_.get(state, 'auth.token', null))) return false;
    const requirePermissions = _.isString(_requirePermissions) ? [_requirePermissions] : _requirePermissions;
    const { roles, permissions } = _.get(state, 'auth', {});
    const rolePass = _.reduce(roles, (res, role) => {
      return res || (_.get(role, 'special') === 'all-access');
    }, false);
    const permissionsPass = (
      (
        _.chain(requirePermissions)
          .map((reqP) => {
            return _.indexOf(permissions, reqP) !== -1;
          })
          .indexOf(false)
          .value()
      ) === -1
    );
    return rolePass || permissionsPass;
  }
};
