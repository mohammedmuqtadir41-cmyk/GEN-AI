import "../style/Home.scss"


const Home = () => {
  return (
    <main>
        <div>
            <div className="header">
                <h1>AI Interview Analyzer</h1>
            </div>
            <textarea name="selfDesciption" id="selfDesciption" placeholder="enter your job description here"></textarea>
            <textarea name="jobDescription" id="jobDescription" placeholder="enter your self description here"></textarea>
            <input type="text" placeholder="please upload your resume here" />
            <button className="submit-btn">Submit</button>
        </div>
    </main>
  )
}

export default Home;