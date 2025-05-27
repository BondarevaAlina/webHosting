import s from './Container2.module.css'

function Container(props) {
    return (
        <>
            <div className={s.container}>
                {props.children}
            </div>
        </>
    )
}

export default Container