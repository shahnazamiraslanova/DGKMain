export default class TableModel {
    public id: number | null = null;
    public body: string | null = null;
    public title: string | null = null;
    public userId: number | null = null;

    constructor(item: any) {
        this._setId(item);
        this._setBody(item);
        this._setTitle(item);
        this._setUserId(item);
    }

    /**
     * set id
     * @param id
     * @private
     */
    private _setId({id,}: any) {
        this.id = id;
    }

    /**
     * set body
     * @param body
     * @private
     */
    _setBody({body,}: any) {
        this.body = body;
    }

    /**
     * set title
     * @param title
     * @private
     */
    _setTitle({title,}: any) {
        this.title = title;
    }

    /**
     * set userId
     * @param userId
     * @private
     */
    _setUserId({userId,}: any) {
        this.userId = userId;
    }

}
