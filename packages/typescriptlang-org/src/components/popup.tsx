import * as React from "react"


export interface popupProps {
	show: boolean,
	html?: string,
	url?: string,
	position?: {left: number, top: number} | null,
	picture?: string
}

export const Popup = (props: popupProps) => {
	return (
<div id="quickTipPopup" className="popup popup-fade-in" style={{left: props.position?.left, top: props.position?.top, opacity: props.show ? 100 : 0}}>
		<div className="popup-container">
			<a className="popup-extract" href={props.url}>
				<div dangerouslySetInnerHTML={{__html: props.html as string}}/>		
			</a>	
		</div>
</div>
	)
}