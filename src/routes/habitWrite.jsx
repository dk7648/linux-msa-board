import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function HabitWrite() {
    let navigate = useNavigate();
    let [title, setTitle] = useState();
    let [content, setContent] = useState();
    let [difficult, setDifficult] = useState();
    let [repeatCount, setRepeatCount] = useState();

    const habitSubmit = async (e) => {
      e.preventDefault();
      const newHabit = {
        title,
        content,
        difficult,
        repeatCount
      };

      try {
        console.log("전송~!!!")
        console.log(repeatCount)
        const response = await axios.post('http://localhost:8080/api/habit/write', newHabit, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log("newHabit")
        console.log(newHabit)
        console.log("생성된 데이터 : ");
        console.log(response.data);
        setTitle('');
        setContent('');
        setDifficult(0);
        setRepeatCount(0);
        navigate("/habit/detail/"+response.data.id);
      } catch (err) {
        console.error(err);
        alert('게시글 작성 중 오류가 발생했습니다.');
      }
    };

    return (
        <>
        <div className="habit-form-wrapper">
  <form className="habit-form" onSubmit={habitSubmit}>
    <label htmlFor="habit-title">제목</label>
    <input
      id="habit-title"
      type="text"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      placeholder="제목을 입력하세요"
      required
    />

    <label htmlFor="habit-content">내용</label>
    <textarea
      id="habit-content"
      value={content}
      onChange={(e) => setContent(e.target.value)}
      placeholder="상세 내용을 입력하세요"
      required
    />

    <label htmlFor="habit-difficult">난이도 (1~5)</label>
    <input
      id="habit-difficult"
      type="number"
      min="1"
      max="5"
      value={difficult}
      onChange={(e) => setDifficult(e.target.value)}
      placeholder="난이도"
      required
    />

    <label htmlFor="habit-repeat">반복 횟수 (주간, 0~7)</label>
    <input
      id="habit-repeat"
      type="number"
      min="0"
      max="7"
      value={repeatCount}
      onChange={(e) => setRepeatCount(e.target.value)}
      placeholder="반복 횟수"
      required
    />

    <button type="submit" className="habit-submit-btn">작성</button>
  </form>
</div>
        </>
    );
}

export default HabitWrite;
