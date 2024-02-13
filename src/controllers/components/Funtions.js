import db from "../../app/models";

const FunDelete = async (req, res) => {
  const { id, table } = req.body;

  console.log(req.body);

  if (!id || !table) {
    return res.status(200).json({
      EM: "Nhập thiếu dữ liệu !!!",
      EC: -2,
      DT: [],
    });
  }

  try {
    let exitUser = await db[table].findByPk(+id);

    if (!exitUser) {
      return res.status(200).json({
        EM: "ID không tồn tại !!!",
        EC: -1,
        DT: [],
      });
    }

    await db[table].destroy({
      where: {
        id: +id,
      },
    });

    return res.status(200).json({
      EM: "Xóa thành công !!!",
      EC: 0,
      DT: [],
    });
  } catch (err) {
    console.log(">> loi", err);
    return res.status(500).json({
      EM: "Lỗi server !!!",
      EC: -5,
      DT: [],
    });
  }
};

export default { FunDelete };
