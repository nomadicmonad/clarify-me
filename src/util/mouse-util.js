
export const getMousePos = (pix_ratio,rect, canvas, evt) => {
            return {
              x: (evt.clientX - rect.left)*pix_ratio,
              y: (evt.clientY - rect.top)*pix_ratio
            };
      }
export const onClick = (sortedCoords,MousePos,evt)=> {
          return getHover(sortedCoords,MousePos)
}

export const getHover = (sortedCoords,MousePos)=> {
    var selectionMade = -1
          if (sortedCoords !== undefined) {
              for (var i =0; i < sortedCoords.length; i++) {
                  var coords = sortedCoords[i]
                  if (coords[0] < MousePos.x && coords[1] < MousePos.y && coords[0] + coords[2] > MousePos.x && coords[1] + coords[3] > MousePos.y) {
                      selectionMade = i;
                  }
              }
          }
          return selectionMade
}