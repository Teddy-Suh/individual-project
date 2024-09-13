import { useNavigate } from "react-router-dom";

const Modal = () => {
  const navigate = useNavigate();

  return (
    <dialog id="login_modal" className="modal">
      <div className="border-2 modal-box border-primary w-96">
        <h3 className="text-lg font-bold">로그인이 필요합니다</h3>
        <p className="py-4">로그인 후 Moveek을 즐겨보세요!</p>
        <div className="modal-action">
          <form method="dialog">
            <button
              onClick={() => navigate("/login")}
              className="mr-4 btn btn-outline btn-primary"
            >
              로그인
            </button>
            <button className="btn btn-outline btn-primary">닫기</button>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default Modal;
