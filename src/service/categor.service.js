const connection = require("../app/database");

class CategorService {
	async detail(id) {
		const statement = `
      SELECT
        DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') AS createTime, id, name, type, content_type AS contentType
      FROM categor WHERE id = ?;`;
		try {
			const [result] = await connection.execute(statement, [id]);
			return result[0];
		} catch (err) {
			console.log("查询分类详情失败：", err);
			return false;
		}
	}
}

module.exports = new CategorService();
